'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsPageSection, forBrandsSolutionsSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ToggleFormItem, TwoColumnGrid } from './EditorLayout';

type FormValues = z.infer<typeof forBrandsSolutionsSchema> & { enabled: boolean };

const DEFAULT_ITEMS: [string, string, string, string] = ['', '', '', ''];

export function ForBrandsSolutionsEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof forBrandsSolutionsSchema>> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(forBrandsSolutionsSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content?.section_title || '',
      items: (section.content?.items || DEFAULT_ITEMS) as [string, string, string, string],
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
        {success && <Alert variant="success"><AlertDescription>For Brands Solutions saved successfully.</AlertDescription></Alert>}

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

        <FormField control={form.control} name="section_title" render={({ field }) => (
          <FormItem><FormLabel>Section Title</FormLabel><FormControl><Textarea {...field} rows={3} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
        )} />

        <TwoColumnGrid>
          <FormField control={form.control} name="items.0" render={({ field }) => (
            <FormItem><FormLabel>Item 1</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="items.1" render={({ field }) => (
            <FormItem><FormLabel>Item 2</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="items.2" render={({ field }) => (
            <FormItem><FormLabel>Item 3</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="items.3" render={({ field }) => (
            <FormItem><FormLabel>Item 4</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>
      </FormStack>
    </Form>
  );
}
