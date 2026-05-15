'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, homeEfficiencySchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription, AdminAlertTitle as AlertTitle } from '@/components/admin/layout/AdminPrimitives';
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';
import {
  ErrorText,
  FormStack,
  HeaderRow,
  SectionStack,
  ToggleFormItem,
  TwoColumnGrid,
} from './EditorLayout';
import { z } from 'zod';




export function HomeEfficiencyEditor({ pageId, section }: { pageId: string, section: CmsPageSection<z.infer<typeof homeEfficiencySchema>> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  type FormValues = z.infer<typeof homeEfficiencySchema> & { enabled: boolean };

  const form = useForm<FormValues>({
    resolver: zodResolver(homeEfficiencySchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content.section_title || '',
      description: section.content.description || '',
      primary_cta_label: section.content.primary_cta_label || '',
      primary_cta_url: section.content.primary_cta_url || '',
      secondary_cta_label: section.content.secondary_cta_label || '',
      secondary_cta_url: section.content.secondary_cta_url || '',
      stats: section.content.stats || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "stats",
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
      router.refresh();
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
        {success && <Alert variant="success"><AlertDescription>Efficiency section saved successfully.</AlertDescription></Alert>}

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
                <Input {...field} maxLength={100} showCount />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} maxLength={400} showCount />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TwoColumnGrid>
          <FormField
            control={form.control}
            name="primary_cta_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary CTA Label</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={40} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primary_cta_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary CTA URL</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={500} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TwoColumnGrid>

        <TwoColumnGrid>
          <FormField
            control={form.control}
            name="secondary_cta_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary CTA Label</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={40} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondary_cta_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary CTA URL</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={500} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TwoColumnGrid>

        <SectionStack>
          <CmsSortableList
            title={`Stats (${fields.length})`}
            items={fields.map((item, index) => ({ key: item.id, value: index }))}
            onMove={move}
            onRemove={remove}
            onAdd={() => append({ title: '', description: '', number: '' })}
            addLabel="Add Stat"
            renderItem={({ item }) => {
              const index = item.value;
              return (
                <>
              <FormField
                control={form.control}
                name={`stats.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={60} showCount />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`stats.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={100} showCount />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`stats.${index}.number`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="30M+" maxLength={20} showCount />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </>
              );
            }}
          />
          {form.formState.errors.stats && <ErrorText>{form.formState.errors.stats.message}</ErrorText>}
        </SectionStack>

      </FormStack>
    </Form>
  );
}
