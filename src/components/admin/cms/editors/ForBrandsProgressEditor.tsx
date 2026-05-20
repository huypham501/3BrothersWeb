'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsPageSection, forBrandsProgressSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ToggleFormItem, TwoColumnGrid } from './EditorLayout';

type FormValues = z.infer<typeof forBrandsProgressSchema> & { enabled: boolean };

const DEFAULT_STEPS: FormValues['steps'] = [
  { title: '', description: '' },
  { title: '', description: '' },
  { title: '', description: '' },
  { title: '', description: '' },
];

export function ForBrandsProgressEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof forBrandsProgressSchema>> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(forBrandsProgressSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content?.section_title || '',
      section_subtitle: section.content?.section_subtitle || '',
      steps: section.content?.steps || DEFAULT_STEPS,
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
        {success && <Alert variant="success"><AlertDescription>For Brands Progress saved successfully.</AlertDescription></Alert>}

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
          <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="section_subtitle" render={({ field }) => (
          <FormItem><FormLabel>Section Subtitle</FormLabel><FormControl><Textarea {...field} rows={4} maxLength={500} showCount /></FormControl><FormMessage /></FormItem>
        )} />

        {[0, 1, 2, 3].map((index) => (
          <TwoColumnGrid key={index}>
            <FormField control={form.control} name={`steps.${index}.title`} render={({ field }) => (
              <FormItem><FormLabel>{`Step ${index + 1} Title`}</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name={`steps.${index}.description`} render={({ field }) => (
              <FormItem><FormLabel>{`Step ${index + 1} Description`}</FormLabel><FormControl><Textarea {...field} rows={3} maxLength={500} showCount /></FormControl><FormMessage /></FormItem>
            )} />
          </TwoColumnGrid>
        ))}
      </FormStack>
    </Form>
  );
}
