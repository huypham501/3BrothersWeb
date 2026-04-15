'use client';

import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, forCreatorsBenefitSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';

type FormValues = z.infer<typeof forCreatorsBenefitSchema> & { enabled: boolean };

const BENEFIT_IDS: Array<FormValues['benefits'][number]['id']> = ['income', 'brand', 'management', 'content'];

export function ForCreatorsBenefitEditor({ pageId, section }: { pageId: string; section: CmsPageSection }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const defaults = section.content?.benefits?.length
    ? section.content.benefits
    : BENEFIT_IDS.map((id) => ({ id, title: '', description: '' }));

  const form = useForm<FormValues>({
    resolver: zodResolver(forCreatorsBenefitSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content?.section_title || '',
      section_description: section.content?.section_description || '',
      contact_cta_label: section.content?.contact_cta_label || '',
      contact_cta_url: section.content?.contact_cta_url || '/contact',
      benefits: defaults,
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: 'benefits' });

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>For Creators Benefit saved successfully.</AlertDescription></Alert>}

        <div className="flex justify-between items-center mb-6">
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormLabel>Enable Section</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Section'}
          </Button>
        </div>

        <FormField control={form.control} name="section_title" render={({ field }) => (
          <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="section_description" render={({ field }) => (
          <FormItem><FormLabel>Section Description</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="contact_cta_label" render={({ field }) => (
            <FormItem><FormLabel>Contact Button Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="contact_cta_url" render={({ field }) => (
            <FormItem><FormLabel>Contact Button URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="space-y-4">
          <h5 className="text-base font-semibold">Benefits</h5>
          {fields.map((item, index) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <FormField control={form.control} name={`benefits.${index}.id`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefit Key</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormField control={form.control} name={`benefits.${index}.title`} render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`benefits.${index}.description`} render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
          ))}
        </div>
      </form>
    </Form>
  );
}
