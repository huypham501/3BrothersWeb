'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, homePartnersSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminImageUpload } from '@/components/admin/controls/AdminImageUpload';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription, AdminAlertTitle as AlertTitle } from '@/components/admin/layout/AdminPrimitives';
import { CmsFieldHint } from '@/components/admin/cms/ux/CmsFieldHint';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';
import {
  ErrorText,
  FormStack,
  HeaderRow,
  ItemCard,
  SectionHeaderRow,
  SectionStack,
  SectionTitle,
  ToggleFormItem,
} from './EditorLayout';
import { z } from 'zod';




export function HomePartnersEditor({ pageId, section }: { pageId: string, section: CmsPageSection<z.infer<typeof homePartnersSchema>> }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  type FormValues = z.infer<typeof homePartnersSchema> & { enabled: boolean };

  const form = useForm<FormValues>({
    resolver: zodResolver(homePartnersSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_label: section.content.section_label || '',
      partners: section.content.partners || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "partners",
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
      form.reset(data); // reset dirty state
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const ux = (fieldPath: string) => getCmsFieldUxSpec('home_partners', fieldPath);

  return (
    <Form {...form}>
      <FormStack onSubmit={form.handleSubmit(onSubmit)}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Partners section saved successfully.</AlertDescription></Alert>}

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
          name="section_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ux('section_label').label ?? 'Section Label (Hidden usually)'}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <CmsFieldHint formId="home_partners" fieldPath="section_label" />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <SectionStack>
          <SectionHeaderRow>
            <SectionTitle>Partners ({fields.length})</SectionTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', logo_image: '', url: '#' })}>
              + Add Partner
            </Button>
          </SectionHeaderRow>
          
          {fields.map((item, index) => (
            <ItemCard key={item.id}>
              <FormField
                control={form.control}
                name={`partners.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`partners.${index}.logo_image`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo Image</FormLabel>
                    <FormControl>
                      <AdminImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Logo Image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`partners.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                Remove
              </Button>
            </ItemCard>
          ))}
          {form.formState.errors.partners && <ErrorText>{form.formState.errors.partners.message}</ErrorText>}
        </SectionStack>

      </FormStack>
    </Form>
  );
}
