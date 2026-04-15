'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, homeCoreCompetenciesSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription, AdminAlertTitle as AlertTitle } from '@/components/admin/layout/AdminPrimitives';
import {
  ErrorText,
  FooterRow,
  FormStack,
  HeaderRow,
  ItemCard,
  SectionHeaderRow,
  SectionStack,
  SectionTitle,
  ToggleFormItem,
  TwoColumnGrid,
} from './EditorLayout';
import { z } from 'zod';




export function HomeCoreCompetenciesEditor({ pageId, section }: { pageId: string, section: CmsPageSection }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  type FormValues = z.infer<typeof homeCoreCompetenciesSchema> & { enabled: boolean };

  const form = useForm<FormValues>({
    resolver: zodResolver(homeCoreCompetenciesSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content.section_title || '',
      services: section.content.services || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(false);
    setErrorMsg(null);
    try {
      const { enabled, ...payload } = data;
      await savePageSection(pageId, section.schema_key, payload, enabled);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      form.reset(data);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <FormStack onSubmit={form.handleSubmit(onSubmit)}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Core Competencies saved successfully.</AlertDescription></Alert>}

        <HeaderRow>
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <ToggleFormItem>
                <FormLabel>Enable Section</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </ToggleFormItem>
            )}
          />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Section'}
          </Button>
        </HeaderRow>

        <FormField
          control={form.control}
          name="section_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <SectionStack>
          <SectionHeaderRow>
            <SectionTitle>Services ({fields.length})</SectionTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '', description: '', image: '', link_url: '#' })}>
              + Add Service
            </Button>
          </SectionHeaderRow>
          
          {fields.map((item, index) => (
            <ItemCard key={item.id}>
              <FormField
                control={form.control}
                name={`services.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`services.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TwoColumnGrid>
                <FormField
                  control={form.control}
                  name={`services.${index}.image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`services.${index}.link_url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TwoColumnGrid>
              <FooterRow>
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  Remove Service
                </Button>
              </FooterRow>
            </ItemCard>
          ))}
          {form.formState.errors.services && <ErrorText>{form.formState.errors.services.message}</ErrorText>}
        </SectionStack>
      </FormStack>
    </Form>
  );
}
