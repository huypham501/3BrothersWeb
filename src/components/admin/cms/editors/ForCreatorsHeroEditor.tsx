'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, forCreatorsHeroSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminImageUpload } from '@/components/admin/controls/AdminImageUpload';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ToggleFormItem, TwoColumnGrid } from './EditorLayout';
import { z } from 'zod';

type FormValues = z.infer<typeof forCreatorsHeroSchema> & { enabled: boolean };

export function ForCreatorsHeroEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof forCreatorsHeroSchema>> }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(forCreatorsHeroSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      title: section.content?.title || '',
      subtitle: section.content?.subtitle || '',
      primary_cta_label: section.content?.primary_cta_label || '',
      primary_cta_url: section.content?.primary_cta_url || '/',
      secondary_cta_label: section.content?.secondary_cta_label || '',
      secondary_cta_url: section.content?.secondary_cta_url || '#benefit',
      media_image: section.content?.media_image || '',
      media_image_alt: section.content?.media_image_alt || '',
      hero_aspect_ratio: section.content?.hero_aspect_ratio || '1440/670',
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
        {success && <Alert variant="success"><AlertDescription>For Creators Hero saved successfully.</AlertDescription></Alert>}

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

        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Title</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="subtitle" render={({ field }) => (
          <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
        )} />

        <TwoColumnGrid>
          <FormField control={form.control} name="primary_cta_label" render={({ field }) => (
            <FormItem><FormLabel>Primary CTA Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="primary_cta_url" render={({ field }) => (
            <FormItem><FormLabel>Primary CTA URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <TwoColumnGrid>
          <FormField control={form.control} name="hero_aspect_ratio" render={({ field }) => (
            <FormItem><FormLabel>Hero Aspect Ratio (W/H)</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="1440/670" /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <TwoColumnGrid>
          <FormField control={form.control} name="media_image" render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Image</FormLabel>
              <FormControl>
                <AdminImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  label="Hero Image"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="media_image_alt" render={({ field }) => (
            <FormItem><FormLabel>Hero Image Alt</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <TwoColumnGrid>
          <FormField control={form.control} name="secondary_cta_label" render={({ field }) => (
            <FormItem><FormLabel>Secondary CTA Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="secondary_cta_url" render={({ field }) => (
            <FormItem><FormLabel>Secondary CTA URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>
      </FormStack>
    </Form>
  );
}
