'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsSharedSection, sharedExclusiveTalentsSchema } from '@/lib/cms';
import { saveSharedSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { z } from 'zod';




export function SharedExclusiveTalentsEditor({ section }: { section: CmsSharedSection }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  type FormValues = z.infer<typeof sharedExclusiveTalentsSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(sharedExclusiveTalentsSchema),
    defaultValues: {
      section_title: section.content.section_title || '',
      featured_name: section.content.featured_name || '',
      featured_handle: section.content.featured_handle || '',
      featured_photo: section.content.featured_photo || '',
      featured_photo_alt: section.content.featured_photo_alt || '',
      featured_description: section.content.featured_description || '',
      featured_stats: section.content.featured_stats || [{ label: '', value: '' }, { label: '', value: '' }],
      talent_count_label: section.content.talent_count_label || '',
      talents: section.content.talents || [],
    },
  });

  const { fields: statFields } = useFieldArray({
    control: form.control,
    name: "featured_stats",
  });

  const { fields: talentFields, append: appendTalent, remove: removeTalent } = useFieldArray({
    control: form.control,
    name: "talents",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(false);
    setErrorMsg(null);
    try {
      await saveSharedSection(section.schema_key, data);
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
        <Alert variant="default" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
          <AlertTitle>Shared Content Warning</AlertTitle>
          <AlertDescription>
            This Exclusive Talents section is shared across multiple pages. Modifying its content here will affect all pages displaying this section.
          </AlertDescription>
        </Alert>

        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Shared talents saved successfully.</AlertDescription></Alert>}

        <div className="flex justify-between items-center mb-6">
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Shared Section'}
          </Button>
        </div>

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

        <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h5 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Featured Talent</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="featured_name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="featured_handle" render={({ field }) => (
              <FormItem><FormLabel>Handle (e.g. @username)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="featured_photo" render={({ field }) => (
              <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="featured_photo_alt" render={({ field }) => (
              <FormItem><FormLabel>Photo Alt Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="featured_description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          
          <div style={{ marginTop: '16px' }}>
            <FormLabel style={{ display: 'block', marginBottom: '8px' }}>Featured Stats (exactly 2 required)</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {statFields.map((item, index) => (
                <div key={item.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '4px' }}>
                  <FormField control={form.control} name={`featured_stats.${index}.label`} render={({ field }) => (
                    <FormItem style={{ marginBottom: '8px' }}><FormLabel>Stat Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`featured_stats.${index}.value`} render={({ field }) => (
                    <FormItem className="col-span-full md:col-span-6"><FormLabel>Stat Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <FormField control={form.control} name="talent_count_label" render={({ field }) => (
            <FormItem><FormLabel>Talent Count Label</FormLabel><FormControl><Input {...field} placeholder="50+ TALENTS" /></FormControl><FormMessage /></FormItem>
          )} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Talent Grid List ({talentFields.length})</h5>
            <Button type="button" variant="outline" size="sm" onClick={() => appendTalent({ name: '', photo: '', photo_alt: '' })}>
              + Add Talent Item
            </Button>
          </div>
          
          {talentFields.map((item, index) => (
            <div className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 border border-slate-200 rounded-lg mb-4 bg-slate-50 items-end" key={item.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name={`talents.${index}.name`} render={({ field }) => (
                  <FormItem className="col-span-full md:col-span-6"><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <FormField control={form.control} name={`talents.${index}.photo`} render={({ field }) => (
                    <FormItem style={{ marginBottom: 0, flex: 1 }}><FormLabel>Photo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeTalent(index)}>Remove</Button>
                </div>
              </div>
            </div>
          ))}
          {form.formState.errors.talents && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{form.formState.errors.talents.message}</p>}
        </div>

      </form>
    </Form>
  );
}
