'use client';

import * as React from 'react';
import { useForm, useFieldArray, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsSharedSection, sharedExclusiveTalentsSchema } from '@/lib/cms';
import { saveSharedSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminImageUpload } from '@/components/admin/controls/AdminImageUpload';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminBadge } from '@/components/admin/layout/AdminPrimitives';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription, AdminAlertTitle as AlertTitle } from '@/components/admin/layout/AdminPrimitives';
import {
  BorderedPanel,
  ErrorText,
  FormStack,
  HeaderRow,
  ItemCard,
  SectionHeaderRow,
  SectionStack,
  SectionTitle,
  TwoColumnGrid,
} from './EditorLayout';
import { z } from 'zod';

export type SharedExclusiveTalentsFormValues = z.infer<typeof sharedExclusiveTalentsSchema>;

const EMPTY_STATS = [{ label: '', value: '' }, { label: '', value: '' }] as const;

function normalizeTalents(
  talents: SharedExclusiveTalentsFormValues['talents'] | undefined
): SharedExclusiveTalentsFormValues['talents'] {
  const list = (talents || []).map((talent) => ({
    name: talent?.name || '',
    handle: talent?.handle || '',
    photo: talent?.photo || '',
    photo_alt: talent?.photo_alt || '',
    description: talent?.description || '',
    stats: talent?.stats?.length === 2
      ? talent.stats.map((stat) => ({ label: stat?.label || '', value: stat?.value || '' }))
      : [{ label: '', value: '' }, { label: '', value: '' }],
    is_featured: !!talent?.is_featured,
  }));

  if (list.length > 0 && !list.some((talent) => talent.is_featured)) {
    list[0].is_featured = true;
  }

  return list;
}

export function getSharedExclusiveTalentsDefaultValues(
  content?: Partial<SharedExclusiveTalentsFormValues> | null
): SharedExclusiveTalentsFormValues {
  const normalizedFromSchema = sharedExclusiveTalentsSchema.safeParse(content ?? {});
  const source = normalizedFromSchema.success ? normalizedFromSchema.data : content;
  const talents = normalizeTalents(source?.talents);

  return {
    section_title: source?.section_title || '',
    talent_count_label: source?.talent_count_label || '',
    talents,
  };
}

export function SharedExclusiveTalentsFields({ form }: { form: UseFormReturn<any> }) {
  const { fields: talentFields, append: appendTalent, remove: removeTalent } = useFieldArray({
    control: form.control,
    name: 'talents',
  });

  const setFeaturedTalent = (targetIndex: number) => {
    const talents = form.getValues('talents') as SharedExclusiveTalentsFormValues['talents'];
    const nextTalents = talents.map((talent, index) => ({
      ...talent,
      is_featured: index === targetIndex,
    }));
    form.setValue('talents', nextTalents, { shouldDirty: true, shouldValidate: true });
  };

  const handleRemoveTalent = (targetIndex: number) => {
    const talents = form.getValues('talents') as SharedExclusiveTalentsFormValues['talents'];
    const willRemoveFeatured = talents[targetIndex]?.is_featured;
    removeTalent(targetIndex);

    if (!willRemoveFeatured) return;

    const nextTalents = form.getValues('talents') as SharedExclusiveTalentsFormValues['talents'];
    if (nextTalents.length === 0) return;

    const reseeded = nextTalents.map((talent, index) => ({
      ...talent,
      is_featured: index === 0,
    }));
    form.setValue('talents', reseeded, { shouldDirty: true, shouldValidate: true });
  };

  const handleAddTalent = () => {
    const existingTalents = form.getValues('talents') as SharedExclusiveTalentsFormValues['talents'];
    appendTalent({
      name: '',
      handle: '',
      photo: '',
      photo_alt: '',
      description: '',
      stats: [{ ...EMPTY_STATS[0] }, { ...EMPTY_STATS[1] }],
      is_featured: existingTalents.length === 0,
    });
  };

  return (
    <>
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

      <SectionStack>
        <FormField control={form.control} name="talent_count_label" render={({ field }) => (
          <FormItem><FormLabel>Talent Count Label</FormLabel><FormControl><Input {...field} placeholder="50+ TALENTS" /></FormControl><FormMessage /></FormItem>
        )} />

        <SectionHeaderRow>
          <SectionTitle>Talent Grid List ({talentFields.length})</SectionTitle>
          <Button type="button" variant="outline" size="sm" onClick={handleAddTalent}>
            + Add Talent Item
          </Button>
        </SectionHeaderRow>

        {talentFields.map((item, index) => (
          <BorderedPanel key={item.id}>
            <HeaderRow style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: 13 }}>Talent #{index + 1}</strong>
                {form.watch(`talents.${index}.is_featured`) ? (
                  <AdminBadge tone="success">Featured</AdminBadge>
                ) : (
                  <AdminBadge tone="neutral">Normal</AdminBadge>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button
                  type="button"
                  variant={form.watch(`talents.${index}.is_featured`) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFeaturedTalent(index)}
                >
                  {form.watch(`talents.${index}.is_featured`) ? 'Featured Talent' : 'Set as Featured'}
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveTalent(index)}>
                  Remove
                </Button>
              </div>
            </HeaderRow>

            <TwoColumnGrid>
              <FormField control={form.control} name={`talents.${index}.name`} render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name={`talents.${index}.handle`} render={({ field }) => (
                <FormItem><FormLabel>Handle (e.g. @username)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </TwoColumnGrid>

            <TwoColumnGrid>
              <FormField control={form.control} name={`talents.${index}.photo`} render={({ field }) => (
                <FormItem><FormLabel>Photo</FormLabel><FormControl>
                  <AdminImageUpload value={field.value} onChange={field.onChange} label="Talent Photo" />
                </FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name={`talents.${index}.photo_alt`} render={({ field }) => (
                <FormItem><FormLabel>Photo Alt Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </TwoColumnGrid>

            <FormField control={form.control} name={`talents.${index}.description`} render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
            )} />

            <SectionStack>
              <SectionTitle>Stats (exactly 2 required)</SectionTitle>
              <TwoColumnGrid>
                {[0, 1].map((statIndex) => (
                  <ItemCard key={`talent-${item.id}-stat-${statIndex}`}>
                    <FormField control={form.control} name={`talents.${index}.stats.${statIndex}.label`} render={({ field }) => (
                      <FormItem><FormLabel>Stat Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`talents.${index}.stats.${statIndex}.value`} render={({ field }) => (
                      <FormItem><FormLabel>Stat Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </ItemCard>
                ))}
              </TwoColumnGrid>
            </SectionStack>
          </BorderedPanel>
        ))}
        {form.formState.errors.talents && <ErrorText>{form.formState.errors.talents.message as string}</ErrorText>}
      </SectionStack>
    </>
  );
}

export function SharedExclusiveTalentsEditor({ section }: { section: CmsSharedSection<z.infer<typeof sharedExclusiveTalentsSchema>> }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<SharedExclusiveTalentsFormValues>({
    resolver: zodResolver(sharedExclusiveTalentsSchema),
    defaultValues: getSharedExclusiveTalentsDefaultValues(section.content),
  });

  const onSubmit = async (data: SharedExclusiveTalentsFormValues) => {
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
      <FormStack onSubmit={form.handleSubmit(onSubmit)}>
        <Alert variant="default" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
          <AlertTitle>Shared Content Warning</AlertTitle>
          <AlertDescription>
            This Exclusive Talents section is shared across multiple pages. Modifying its content here will affect all pages displaying this section.
          </AlertDescription>
        </Alert>

        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Shared talents saved successfully.</AlertDescription></Alert>}

        <HeaderRow>
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Shared Section'}
          </Button>
        </HeaderRow>

        <SharedExclusiveTalentsFields form={form} />

      </FormStack>
    </Form>
  );
}
