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

type LegacyCard = {
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
  brand_card_stat?: string;
  stats?: Array<{ value?: unknown; label?: unknown }>;
  is_featured?: boolean;
};

type FormValues = {
  enabled: boolean;
  section_title: string;
  brand_count_label: string;
  brand_cards: Array<{
    name: string;
    handle: string;
    photo: string;
    photo_alt: string;
    description: string;
    brand_card_stat: string;
    is_featured: boolean;
  }>;
};

const formSchema = z.object({
  enabled: z.boolean(),
  section_title: z.string().max(120),
  brand_count_label: z.string().max(20),
  brand_cards: z.array(
    z.object({
      name: z.string().max(80),
      handle: z.string().max(40),
      photo: z.string().max(1024),
      photo_alt: z.string().max(125),
      description: z.string().max(1000),
      brand_card_stat: z.string().max(120),
      is_featured: z.boolean(),
    })
  ).min(1).max(20),
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

function normalizeText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function normalizeCards(cards: unknown): FormValues['brand_cards'] {
  const rawCards = Array.isArray(cards) ? cards : [];
  return rawCards.map((item) => {
    const raw = (item && typeof item === 'object' ? item : {}) as LegacyCard;
    const firstLegacyStatValue = Array.isArray(raw.stats) ? normalizeText(raw.stats[0]?.value) : '';
    return {
      name: raw.name || raw.brand || '',
      handle: raw.handle || '',
      photo: raw.photo ?? raw.image ?? '',
      photo_alt: raw.photo_alt ?? raw.image_alt ?? '',
      description: raw.description || raw.metric || '',
      brand_card_stat: raw.brand_card_stat || firstLegacyStatValue || normalizeText(raw.metric),
      is_featured: raw.is_featured ?? !!raw.active,
    };
  });
}

function mapIssuePathToFormPath(path: PropertyKey[]): string | null {
  if (path.length === 0 || path.some((segment) => typeof segment === 'symbol')) return null;
  const [root, second, third] = path;
  if (root === 'brand_cards' && typeof second === 'number' && (third === 'name' || third === 'handle' || third === 'photo' || third === 'photo_alt' || third === 'description' || third === 'brand_card_stat' || third === 'is_featured')) {
    return `brand_cards.${second}.${third}`;
  }
  if (root === 'enabled' || root === 'section_title' || root === 'brand_count_label') return root;
  return null;
}

export function ForBrandsCaseStudiesEditor({ pageId, section }: { pageId: string; section: CmsPageSection<any> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const defaultCards = normalizeCards(section.content?.brand_cards);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: section.enabled,
      section_title: typeof section.content?.section_title === 'string' ? section.content.section_title : '',
      brand_count_label: typeof section.content?.brand_count_label === 'string' ? section.content.brand_count_label : '',
      brand_cards: defaultCards,
    },
  });

  const { fields: brandCardFields, append: appendBrandCard, remove: removeBrandCard, move: moveBrandCard } = useFieldArray({
    control: form.control,
    name: 'brand_cards',
  });

  const setFeaturedCard = (targetIndex: number) => {
    const cards = form.getValues('brand_cards');
    form.setValue('brand_cards', cards.map((card, index) => ({ ...card, is_featured: index === targetIndex })), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveCard = (targetIndex: number) => {
    const cards = form.getValues('brand_cards');
    const willRemoveFeatured = cards[targetIndex]?.is_featured;
    removeBrandCard(targetIndex);
    if (!willRemoveFeatured) return;
    const nextCards = form.getValues('brand_cards');
    if (nextCards.length === 0) return;
    form.setValue('brand_cards', nextCards.map((card, index) => ({ ...card, is_featured: index === 0 })), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleAddBrandCard = () => {
    const existingCards = form.getValues('brand_cards');
    appendBrandCard({
      name: '',
      handle: '',
      photo: '',
      photo_alt: '',
      description: '',
      brand_card_stat: '3.5M+ FOLLOWERS',
      is_featured: existingCards.length === 0,
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(false);
    setErrorMsg(null);
    form.clearErrors();

    try {
      const payload = {
        section_title: data.section_title,
        brand_count_label: data.brand_count_label || null,
        brand_cards: data.brand_cards.map((item) => ({
          name: item.name,
          handle: item.handle,
          photo: item.photo || null,
          photo_alt: item.photo_alt || null,
          description: item.description,
          brand_card_stat: item.brand_card_stat,
          is_featured: item.is_featured,
        })),
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
        if (!hasMappedFieldError) setErrorMsg(parsed.error.message);
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
          <FormField control={form.control} name="section_title" render={({ field }) => (
            <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="brand_count_label" render={({ field }) => (
            <FormItem><FormLabel>Brand Count Label</FormLabel><FormControl><Input {...field} placeholder="50+ BRANDS" maxLength={20} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <SectionStack>
          <CmsSortableList
            title={`Brand Cards (${brandCardFields.length}/20)`}
            items={brandCardFields.map((item, index) => ({ key: item.id, value: index }))}
            onMove={moveBrandCard}
            onRemove={handleRemoveCard}
            onAdd={handleAddBrandCard}
            addLabel="Add Brand Card"
            renderItem={({ item }) => {
              const index = item.value;
              return (
                <BorderedPanel key={item.key}>
                  <HeaderRow style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 13 }}>{`Card #${index + 1}`}</strong>
                      {form.watch(`brand_cards.${index}.is_featured`) ? <AdminBadge tone="success">Featured</AdminBadge> : <AdminBadge tone="neutral">Normal</AdminBadge>}
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
                          label="Brand Card Photo"
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

                  <FormField control={form.control} name={`brand_cards.${index}.brand_card_stat`} render={({ field }) => (
                    <FormItem><FormLabel>Brand Card Stat</FormLabel><FormControl><Input {...field} maxLength={120} placeholder="3.5M+ FOLLOWERS" showCount /></FormControl><FormMessage /></FormItem>
                  )} />
                </BorderedPanel>
              );
            }}
          />
          {form.formState.errors.brand_cards && <ErrorText>{form.formState.errors.brand_cards.message as string}</ErrorText>}
        </SectionStack>
      </FormStack>
    </Form>
  );
}
