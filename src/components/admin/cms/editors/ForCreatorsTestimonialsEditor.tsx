'use client';

import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, forCreatorsTestimonialsSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';

type FormValues = z.infer<typeof forCreatorsTestimonialsSchema> & { enabled: boolean };

export function ForCreatorsTestimonialsEditor({ pageId, section }: { pageId: string; section: CmsPageSection }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(forCreatorsTestimonialsSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      superlabel: section.content?.superlabel || '',
      section_title: section.content?.section_title || '',
      testimonials: section.content?.testimonials || [
        { quote: '', name: '', role: '' },
        { quote: '', name: '', role: '' },
        { quote: '', name: '', role: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'testimonials' });

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
        {success && <Alert variant="success"><AlertDescription>For Creators Testimonials saved successfully.</AlertDescription></Alert>}

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="superlabel" render={({ field }) => (
            <FormItem><FormLabel>Superlabel</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="section_title" render={({ field }) => (
            <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h5 className="text-base font-semibold">Testimonials ({fields.length})</h5>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ quote: '', name: '', role: '' })}>
              + Add Testimonial
            </Button>
          </div>
          {fields.map((item, index) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <FormField control={form.control} name={`testimonials.${index}.quote`} render={({ field }) => (
                <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <FormField control={form.control} name={`testimonials.${index}.name`} render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`testimonials.${index}.role`} render={({ field }) => (
                  <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} disabled={fields.length <= 1}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </form>
    </Form>
  );
}
