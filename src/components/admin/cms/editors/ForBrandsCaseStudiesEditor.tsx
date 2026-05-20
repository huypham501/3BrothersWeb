'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsPageSection, forBrandsCaseStudiesSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ToggleFormItem, TwoColumnGrid } from './EditorLayout';

type FormValues = {
  enabled: boolean;
  eyebrow: string;
  section_title: string;
  featured_brand: string;
  featured_project: string;
  featured_description: string;
  featured_media_image?: string | null;
  featured_media_image_alt?: string | null;
  featured_stats_json: string;
  brand_cards_json: string;
  categories_json: string;
};

export function ForBrandsCaseStudiesEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof forBrandsCaseStudiesSchema>> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const content = section.content ?? {
    eyebrow: '',
    section_title: '',
    featured_brand: '',
    featured_project: '',
    featured_description: '',
    featured_media_image: null,
    featured_media_image_alt: null,
    featured_stats: [],
    brand_cards: [],
    categories: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({
      enabled: z.boolean(),
      eyebrow: z.string().max(80),
      section_title: z.string().max(120),
      featured_brand: z.string().max(80),
      featured_project: z.string().max(120),
      featured_description: z.string().max(1000),
      featured_media_image: z.string().max(1024).nullable().optional(),
      featured_media_image_alt: z.string().max(125).nullable().optional(),
      featured_stats_json: z.string(),
      brand_cards_json: z.string(),
      categories_json: z.string(),
    })),
    defaultValues: {
      enabled: section.enabled,
      eyebrow: content.eyebrow || '',
      section_title: content.section_title || '',
      featured_brand: content.featured_brand || '',
      featured_project: content.featured_project || '',
      featured_description: content.featured_description || '',
      featured_media_image: content.featured_media_image ?? '',
      featured_media_image_alt: content.featured_media_image_alt ?? '',
      featured_stats_json: JSON.stringify(content.featured_stats ?? [], null, 2),
      brand_cards_json: JSON.stringify(content.brand_cards ?? [], null, 2),
      categories_json: JSON.stringify(content.categories ?? [], null, 2),
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(false);
    setErrorMsg(null);
    try {
      const payload = {
        eyebrow: data.eyebrow,
        section_title: data.section_title,
        featured_brand: data.featured_brand,
        featured_project: data.featured_project,
        featured_description: data.featured_description,
        featured_media_image: data.featured_media_image || null,
        featured_media_image_alt: data.featured_media_image_alt || null,
        featured_stats: JSON.parse(data.featured_stats_json),
        brand_cards: JSON.parse(data.brand_cards_json),
        categories: JSON.parse(data.categories_json),
      };

      const validated = forBrandsCaseStudiesSchema.parse(payload);
      await savePageSection(pageId, section.schema_key, validated, data.enabled);
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
        {success && <Alert variant="success"><AlertDescription>For Brands Case Studies saved successfully.</AlertDescription></Alert>}

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

        <TwoColumnGrid>
          <FormField control={form.control} name="eyebrow" render={({ field }) => (
            <FormItem><FormLabel>Eyebrow</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="section_title" render={({ field }) => (
            <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <TwoColumnGrid>
          <FormField control={form.control} name="featured_brand" render={({ field }) => (
            <FormItem><FormLabel>Featured Brand</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="featured_project" render={({ field }) => (
            <FormItem><FormLabel>Featured Project</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <FormField control={form.control} name="featured_description" render={({ field }) => (
          <FormItem><FormLabel>Featured Description</FormLabel><FormControl><Textarea {...field} rows={5} maxLength={1000} showCount /></FormControl><FormMessage /></FormItem>
        )} />

        <TwoColumnGrid>
          <FormField control={form.control} name="featured_media_image" render={({ field }) => (
            <FormItem><FormLabel>Featured Media Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} maxLength={1024} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="featured_media_image_alt" render={({ field }) => (
            <FormItem><FormLabel>Featured Media Image Alt</FormLabel><FormControl><Input {...field} value={field.value ?? ''} maxLength={125} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <FormField control={form.control} name="featured_stats_json" render={({ field }) => (
          <FormItem>
            <FormLabel>Featured Stats (JSON Array)</FormLabel>
            <FormControl><Textarea {...field} rows={8} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="brand_cards_json" render={({ field }) => (
          <FormItem>
            <FormLabel>Brand Cards (JSON Array)</FormLabel>
            <FormControl><Textarea {...field} rows={10} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="categories_json" render={({ field }) => (
          <FormItem>
            <FormLabel>Categories (JSON Array)</FormLabel>
            <FormControl><Textarea {...field} rows={6} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </FormStack>
    </Form>
  );
}
