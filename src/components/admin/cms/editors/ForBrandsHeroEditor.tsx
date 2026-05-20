'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsPageSection, forBrandsHeroSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ToggleFormItem, TwoColumnGrid } from './EditorLayout';

type FormValues = z.infer<typeof forBrandsHeroSchema> & { enabled: boolean };

export function ForBrandsHeroEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof forBrandsHeroSchema>> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(forBrandsHeroSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      title: section.content?.title || '',
      subtitle: section.content?.subtitle || '',
      primary_cta_label: section.content?.primary_cta_label || '',
      primary_cta_url: section.content?.primary_cta_url || '/contact',
      secondary_cta_label: section.content?.secondary_cta_label || '',
      secondary_cta_url: section.content?.secondary_cta_url || '/social-commerce',
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
        {success && <Alert variant="success"><AlertDescription>For Brands Hero saved successfully.</AlertDescription></Alert>}

        <HeaderRow>
          <FormField control={form.control} name="enabled" render={({ field }) => (
            <ToggleFormItem>
              <FormLabel>Enable Section</FormLabel>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </ToggleFormItem>
          )} />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Section'}
          </Button>
        </HeaderRow>

        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Title</FormLabel><FormControl><Textarea {...field} rows={3} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="subtitle" render={({ field }) => (
          <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} rows={4} maxLength={500} showCount /></FormControl><FormMessage /></FormItem>
        )} />

        <TwoColumnGrid>
          <FormField control={form.control} name="primary_cta_label" render={({ field }) => (
            <FormItem><FormLabel>Primary CTA Label</FormLabel><FormControl><Input {...field} maxLength={40} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="primary_cta_url" render={({ field }) => (
            <FormItem><FormLabel>Primary CTA URL</FormLabel><FormControl><Input {...field} maxLength={500} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <TwoColumnGrid>
          <FormField control={form.control} name="secondary_cta_label" render={({ field }) => (
            <FormItem><FormLabel>Secondary CTA Label</FormLabel><FormControl><Input {...field} value={field.value ?? ''} maxLength={40} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="secondary_cta_url" render={({ field }) => (
            <FormItem><FormLabel>Secondary CTA URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} maxLength={500} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>
      </FormStack>
    </Form>
  );
}
