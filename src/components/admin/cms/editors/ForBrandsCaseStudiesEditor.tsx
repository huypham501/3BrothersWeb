'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Path, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsPageSection, forBrandsCaseStudiesSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminImageUpload } from '@/components/admin/controls/AdminImageUpload';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';
import { BorderedPanel, ErrorText, FormStack, HeaderRow, SectionStack, ToggleFormItem, TwoColumnGrid } from './EditorLayout';

type CaseStudiesValues = z.infer<typeof forBrandsCaseStudiesSchema>;

type FormValues = {
  enabled: boolean;
  eyebrow: string;
  section_title: string;
  featured_brand: string;
  featured_project: string;
  featured_description: string;
  featured_media_image: string;
  featured_media_image_alt: string;
  featured_stats: Array<{ value: string; label: string }>;
  brand_cards: Array<{ brand: string; metric: string; active: boolean; image: string; image_alt: string }>;
  categories: Array<{ value: string }>;
};

const formSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().max(80),
  section_title: z.string().max(120),
  featured_brand: z.string().max(80),
  featured_project: z.string().max(120),
  featured_description: z.string().max(1000),
  featured_media_image: z.string().max(1024),
  featured_media_image_alt: z.string().max(125),
  featured_stats: z.array(
    z.object({
      value: z.string().max(40),
      label: z.string().max(60),
    })
  ).max(4),
  brand_cards: z.array(
    z.object({
      brand: z.string().max(80),
      metric: z.string().max(120),
      active: z.boolean(),
      image: z.string().max(1024),
      image_alt: z.string().max(125),
    })
  ).max(20),
  categories: z.array(z.object({ value: z.string().max(60) })).max(20),
});

function normalizeCaseStudiesContent(content: CaseStudiesValues | null | undefined): FormValues {
  return {
    enabled: true,
    eyebrow: content?.eyebrow || '',
    section_title: content?.section_title || '',
    featured_brand: content?.featured_brand || '',
    featured_project: content?.featured_project || '',
    featured_description: content?.featured_description || '',
    featured_media_image: content?.featured_media_image ?? '',
    featured_media_image_alt: content?.featured_media_image_alt ?? '',
    featured_stats: (content?.featured_stats || []).map((item) => ({
      value: item?.value || '',
      label: item?.label || '',
    })),
    brand_cards: (content?.brand_cards || []).map((item) => ({
      brand: item?.brand || '',
      metric: item?.metric || '',
      active: !!item?.active,
      image: item?.image ?? '',
      image_alt: item?.image_alt ?? '',
    })),
    categories: (content?.categories || []).map((item) => ({ value: item || '' })),
  };
}

function mapIssuePathToFormPath(path: PropertyKey[]): string | null {
  if (path.length === 0) return null;
  if (path.some((segment) => typeof segment === 'symbol')) return null;
  const [root, second, third] = path;

  if (root === 'categories' && typeof second === 'number') {
    return `categories.${second}.value`;
  }
  if (root === 'featured_stats' && typeof second === 'number' && (third === 'value' || third === 'label')) {
    return `featured_stats.${second}.${third}`;
  }
  if (root === 'brand_cards' && typeof second === 'number'
    && (third === 'brand' || third === 'metric' || third === 'active' || third === 'image' || third === 'image_alt')) {
    return `brand_cards.${second}.${third}`;
  }
  if (
    root === 'eyebrow'
    || root === 'section_title'
    || root === 'featured_brand'
    || root === 'featured_project'
    || root === 'featured_description'
    || root === 'featured_media_image'
    || root === 'featured_media_image_alt'
  ) {
    return root;
  }
  return null;
}

export function ForBrandsCaseStudiesEditor({ pageId, section }: { pageId: string; section: CmsPageSection<CaseStudiesValues> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const normalizedDefaults = normalizeCaseStudiesContent(section.content);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: section.enabled,
      eyebrow: normalizedDefaults.eyebrow,
      section_title: normalizedDefaults.section_title,
      featured_brand: normalizedDefaults.featured_brand,
      featured_project: normalizedDefaults.featured_project,
      featured_description: normalizedDefaults.featured_description,
      featured_media_image: normalizedDefaults.featured_media_image,
      featured_media_image_alt: normalizedDefaults.featured_media_image_alt,
      featured_stats: normalizedDefaults.featured_stats,
      brand_cards: normalizedDefaults.brand_cards,
      categories: normalizedDefaults.categories,
    },
  });
  const {
    fields: featuredStatsFields,
    append: appendFeaturedStat,
    remove: removeFeaturedStat,
    move: moveFeaturedStat,
  } = useFieldArray({ control: form.control, name: 'featured_stats' });
  const {
    fields: brandCardFields,
    append: appendBrandCard,
    remove: removeBrandCard,
    move: moveBrandCard,
  } = useFieldArray({ control: form.control, name: 'brand_cards' });
  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
    move: moveCategory,
  } = useFieldArray({ control: form.control, name: 'categories' });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(false);
    setErrorMsg(null);
    form.clearErrors();
    try {
      const payload = {
        eyebrow: data.eyebrow,
        section_title: data.section_title,
        featured_brand: data.featured_brand,
        featured_project: data.featured_project,
        featured_description: data.featured_description,
        featured_media_image: data.featured_media_image || null,
        featured_media_image_alt: data.featured_media_image_alt || null,
        featured_stats: data.featured_stats,
        brand_cards: data.brand_cards.map((item) => ({
          ...item,
          image: item.image || null,
          image_alt: item.image_alt || null,
        })),
        categories: data.categories.map((item) => item.value),
      };

      const parsed = forBrandsCaseStudiesSchema.safeParse(payload);
      if (!parsed.success) {
        let hasMappedFieldError = false;
        for (const issue of parsed.error.issues) {
          const formPath = mapIssuePathToFormPath(issue.path);
          if (!formPath) continue;
          form.setError(formPath as Path<FormValues>, { type: 'manual', message: issue.message });
          hasMappedFieldError = true;
        }

        if (!hasMappedFieldError) {
          setErrorMsg(parsed.error.message);
        }
        return;
      }

      await savePageSection(pageId, section.schema_key, parsed.data, data.enabled);
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
            <FormItem><FormLabel>Featured Media Image</FormLabel><FormControl>
              <AdminImageUpload
                value={field.value}
                onChange={(nextUrl) => {
                  form.setValue('featured_media_image', nextUrl, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                label="Featured Media"
              />
            </FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="featured_media_image_alt" render={({ field }) => (
            <FormItem><FormLabel>Featured Media Image Alt</FormLabel><FormControl><Input {...field} value={field.value ?? ''} maxLength={125} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <SectionStack>
          <CmsSortableList
            title={`Featured Stats (${featuredStatsFields.length}/4)`}
            items={featuredStatsFields.map((item, index) => ({ key: item.id, value: index }))}
            onMove={moveFeaturedStat}
            onRemove={removeFeaturedStat}
            onAdd={() => appendFeaturedStat({ value: '', label: '' })}
            addLabel="Add Featured Stat"
            renderItem={({ item }) => {
              const index = item.value;
              return (
                <BorderedPanel key={item.key}>
                  <TwoColumnGrid>
                    <FormField control={form.control} name={`featured_stats.${index}.value`} render={({ field }) => (
                      <FormItem><FormLabel>Value</FormLabel><FormControl><Input {...field} maxLength={40} showCount /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`featured_stats.${index}.label`} render={({ field }) => (
                      <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} maxLength={60} showCount /></FormControl><FormMessage /></FormItem>
                    )} />
                  </TwoColumnGrid>
                </BorderedPanel>
              );
            }}
          />
          {form.formState.errors.featured_stats && <ErrorText>{form.formState.errors.featured_stats.message as string}</ErrorText>}
        </SectionStack>

        <SectionStack>
          <CmsSortableList
            title={`Brand Cards (${brandCardFields.length}/20)`}
            items={brandCardFields.map((item, index) => ({ key: item.id, value: index }))}
            onMove={moveBrandCard}
            onRemove={removeBrandCard}
            onAdd={() => appendBrandCard({ brand: '', metric: '', active: false, image: '', image_alt: '' })}
            addLabel="Add Brand Card"
            renderItem={({ item }) => {
              const index = item.value;
              return (
                <BorderedPanel key={item.key}>
                  <HeaderRow>
                    <strong style={{ fontSize: 13 }}>{`Card #${index + 1}`}</strong>
                    <FormField control={form.control} name={`brand_cards.${index}.active`} render={({ field }) => (
                      <ToggleFormItem>
                        <FormLabel>Active</FormLabel>
                        <FormControl><Switch checked={field.value ?? false} onCheckedChange={field.onChange} /></FormControl>
                      </ToggleFormItem>
                    )} />
                  </HeaderRow>

                  <TwoColumnGrid>
                    <FormField control={form.control} name={`brand_cards.${index}.brand`} render={({ field }) => (
                      <FormItem><FormLabel>Brand</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`brand_cards.${index}.metric`} render={({ field }) => (
                      <FormItem><FormLabel>Metric</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
                    )} />
                  </TwoColumnGrid>

                  <TwoColumnGrid>
                    <FormField control={form.control} name={`brand_cards.${index}.image`} render={({ field }) => (
                      <FormItem><FormLabel>Image</FormLabel><FormControl>
                        <AdminImageUpload
                          value={field.value}
                          onChange={(nextUrl) => {
                            form.setValue(`brand_cards.${index}.image`, nextUrl, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                          label="Brand Card Image"
                        />
                      </FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`brand_cards.${index}.image_alt`} render={({ field }) => (
                      <FormItem><FormLabel>Image Alt</FormLabel><FormControl><Input {...field} maxLength={125} showCount /></FormControl><FormMessage /></FormItem>
                    )} />
                  </TwoColumnGrid>
                </BorderedPanel>
              );
            }}
          />
          {form.formState.errors.brand_cards && <ErrorText>{form.formState.errors.brand_cards.message as string}</ErrorText>}
        </SectionStack>

        <SectionStack>
          <CmsSortableList
            title={`Categories (${categoryFields.length}/20)`}
            items={categoryFields.map((item, index) => ({ key: item.id, value: index }))}
            onMove={moveCategory}
            onRemove={removeCategory}
            onAdd={() => appendCategory({ value: '' })}
            addLabel="Add Category"
            renderItem={({ item }) => {
              const index = item.value;
              return (
                <BorderedPanel key={item.key}>
                  <FormField control={form.control} name={`categories.${index}.value`} render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} maxLength={60} showCount /></FormControl><FormMessage /></FormItem>
                  )} />
                </BorderedPanel>
              );
            }}
          />
          {form.formState.errors.categories && <ErrorText>{form.formState.errors.categories.message as string}</ErrorText>}
        </SectionStack>
      </FormStack>
    </Form>
  );
}
