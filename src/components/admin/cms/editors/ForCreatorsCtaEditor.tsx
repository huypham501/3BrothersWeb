'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, forCreatorsCtaSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ToggleFormItem, TwoColumnGrid } from './EditorLayout';
import { z } from 'zod';

type FormValues = z.infer<typeof forCreatorsCtaSchema> & { enabled: boolean };

export function ForCreatorsCtaEditor({ pageId, section }: { pageId: string; section: CmsPageSection }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(forCreatorsCtaSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      heading: section.content?.heading || '',
      subtitle: section.content?.subtitle || '',
      cta_label: section.content?.cta_label || '',
      cta_url: section.content?.cta_url || '/contact',
    },
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
        {success && <Alert variant="success"><AlertDescription>For Creators CTA saved successfully.</AlertDescription></Alert>}

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

        <FormField control={form.control} name="heading" render={({ field }) => (
          <FormItem><FormLabel>Heading</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="subtitle" render={({ field }) => (
          <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
        )} />

        <TwoColumnGrid>
          <FormField control={form.control} name="cta_label" render={({ field }) => (
            <FormItem><FormLabel>CTA Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="cta_url" render={({ field }) => (
            <FormItem><FormLabel>CTA URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>
      </FormStack>
    </Form>
  );
}
