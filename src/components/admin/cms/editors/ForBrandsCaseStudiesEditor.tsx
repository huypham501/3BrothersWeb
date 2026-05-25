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
import { AdminBadge } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';
import { BorderedPanel, ErrorText, FormStack, HeaderRow, SectionStack, ToggleFormItem, TwoColumnGrid } from './EditorLayout';

type LegacyCaseStudiesValues = {
  eyebrow: string;
  section_title: string;
  featured_brand: string;
  featured_project: string;
  featured_description: string;
  featured_media_image?: string | null;
  featured_media_image_alt?: string | null;
  featured_stats?: Array<{ value?: string; label?: string }>;
  brand_cards?: Array<{
    brand?: string;
    metric?: string;
    active?: boolean;
    image?: string | null;
    image_alt?: string | null;
    name?: string;
    handle?: string;
    photo?: string | null;
    photo_alt?: string | null;
    description?: string;
    stats?: Array<{ value?: unknown; label?: unknown }>;
    is_featured?: boolean;
  }>;
  categories?: string[];
};

type BrandCardFormValue = {
  name: string;
  handle: string;
  photo: string;
  photo_alt: string;
  description: string;
  stats: Array<{ value: string; label: string }>;
  is_featured: boolean;
};

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
  brand_cards: BrandCardFormValue[];
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
      name: z.string().max(80),
      handle: z.string().max(40),
      photo: z.string().max(1024),
      photo_alt: z.string().max(125),
      description: z.string().max(1000),
      stats: z.array(
        z.object({
          value: z.string().max(40),
          label: z.string().max(60),
        })
      ).length(2),
      is_featured: z.boolean(),
    })
  ).min(1).max(20),
  categories: z.array(z.object({ value: z.string().max(60) })).max(20),
}).superRefine((value, ctx) => {
  const featuredCount = value.brand_cards.filter((card) => card.is_featured).length;
  if (featuredCount !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Exactly one brand card must be featured.',
      path: ['brand_cards'],
    });
  }
});

function normalizeCaseStudiesContent(content: LegacyCaseStudiesValues | null | undefined): FormValues {
  const normalizeStatValue = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return '';
  };

  const normalizeStats = (stats: unknown, legacyMetric: unknown): BrandCardFormValue['stats'] => {
    if (Array.isArray(stats) && stats.length === 2) {
      const first = (stats[0] && typeof stats[0] === 'object' ? stats[0] : {}) as Record<string, unknown>;
      const second = (stats[1] && typeof stats[1] === 'object' ? stats[1] : {}) as Record<string, unknown>;
      return [
        { label: normalizeStatValue(first.label), value: normalizeStatValue(first.value) },
        { label: normalizeStatValue(second.label), value: normalizeStatValue(second.value) },
      ];
    }
    return [
      { label: 'Metric', value: normalizeStatValue(legacyMetric) },
      { label: '', value: '' },
    ];
  };

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
      name: item?.name || item?.brand || '',
      handle: item?.handle || '',
      photo: item?.photo ?? item?.image ?? '',
      photo_alt: item?.photo_alt ?? item?.image_alt ?? '',
      description: item?.description || item?.metric || '',
      stats: normalizeStats(item?.stats, item?.metric),
      is_featured: item?.is_featured ?? !!item?.active,
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
    && (third === 'name' || third === 'handle' || third === 'photo' || third === 'photo_alt' || third === 'description' || third === 'is_featured')) {
    return `brand_cards.${second}.${third}`;
  }
  if (root === 'brand_cards' && typeof second === 'number' && third === 'stats') {
    return 'brand_cards';
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

export function ForBrandsCaseStudiesEditor({ pageId, section }: { pageId: string; section: CmsPageSection<any> }) {
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
  const setFeaturedCard = (targetIndex: number) => {
    const cards = form.getValues('brand_cards');
    const nextCards = cards.map((card, index) => ({
      ...card,
      is_featured: index === targetIndex,
    }));
    form.setValue('brand_cards', nextCards, { shouldDirty: true, shouldValidate: true });
  };
  const handleRemoveCard = (targetIndex: number) => {
    const cards = form.getValues('brand_cards');
    const removingFeatured = cards[targetIndex]?.is_featured;
    removeBrandCard(targetIndex);
    if (!removingFeatured) return;
    const nextCards = form.getValues('brand_cards');
    if (nextCards.length === 0) return;
    const reseeded = nextCards.map((card, index) => ({
      ...card,
      is_featured: index === 0,
    }));
    form.setValue('brand_cards', reseeded, { shouldDirty: true, shouldValidate: true });
  };

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
          name: item.name,
          handle: item.handle,
          photo: item.photo || null,
          photo_alt: item.photo_alt || null,
          description: item.description,
          stats: item.stats,
          is_featured: item.is_featured,
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
            onAdd={() => appendBrandCard({
              name: '',
              handle: '',
              photo: '',
              photo_alt: '',
              description: '',
              stats: [{ label: '', value: '' }, { label: '', value: '' }],
              is_featured: brandCardFields.length === 0,
            })}
            addLabel="Add Brand Card"
            renderItem={({ item }) => {
              const index = item.value;
              return (
                <BorderedPanel key={item.key}>
                  <HeaderRow style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 13 }}>{`Card #${index + 1}`}</strong>
                      {form.watch(`brand_cards.${index}.is_featured`) ? (
                        <AdminBadge tone="success">Featured</AdminBadge>
                      ) : (
                        <AdminBadge tone="neutral">Normal</AdminBadge>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Button
                        type="button"
                        variant={form.watch(`brand_cards.${index}.is_featured`) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFeaturedCard(index)}
                      >
                        {form.watch(`brand_cards.${index}.is_featured`) ? 'Featured Card' : 'Set as Featured'}
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveCard(index)}>
                        Remove
                      </Button>
                    </div>
                  </HeaderRow>

                  <TwoColumnGrid>
                    <FormField control={form.control} name={`brand_cards.${index}.name`} render={({ field }) => (
                      <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`brand_cards.${index}.handle`} render={({ field }) => (
                      <FormItem><FormLabel>Handle</FormLabel><FormControl><Input {...field} maxLength={40} showCount /></FormControl><FormMessage /></FormItem>
                    )} />
                  </TwoColumnGrid>

                  <TwoColumnGrid>
                    <FormField control={form.control} name={`brand_cards.${index}.photo`} render={({ field }) => (
                      <FormItem><FormLabel>Photo</FormLabel><FormControl>
                        <AdminImageUpload
                          value={field.value}
                          onChange={(nextUrl) => {
                            form.setValue(`brand_cards.${index}.photo`, nextUrl, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                          label="Brand Card Image"
                        />
                      </FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`brand_cards.${index}.photo_alt`} render={({ field }) => (
                      <FormItem><FormLabel>Photo Alt</FormLabel><FormControl><Input {...field} maxLength={125} showCount /></FormControl><FormMessage /></FormItem>
                    )} />
                  </TwoColumnGrid>

                  <FormField control={form.control} name={`brand_cards.${index}.description`} render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={4} maxLength={1000} showCount /></FormControl><FormMessage /></FormItem>
                  )} />

                  <SectionStack>
                    <strong style={{ fontSize: 13 }}>Stats (exactly 2 required)</strong>
                    <TwoColumnGrid>
                      {[0, 1].map((statIndex) => (
                        <BorderedPanel key={`${item.key}-stat-${statIndex}`}>
                          <FormField control={form.control} name={`brand_cards.${index}.stats.${statIndex}.label`} render={({ field }) => (
                            <FormItem><FormLabel>Stat Label</FormLabel><FormControl><Input {...field} maxLength={60} showCount /></FormControl><FormMessage /></FormItem>
                          )} />
                          <FormField control={form.control} name={`brand_cards.${index}.stats.${statIndex}.value`} render={({ field }) => (
                            <FormItem><FormLabel>Stat Value</FormLabel><FormControl><Input {...field} maxLength={40} showCount /></FormControl><FormMessage /></FormItem>
                          )} />
                        </BorderedPanel>
                      ))}
                    </TwoColumnGrid>
                  </SectionStack>
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
