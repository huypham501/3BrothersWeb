'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsSharedSection, sharedExclusiveTalentsSchema } from '@/lib/cms';
import { saveSharedSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
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

export function SharedExclusiveTalentsEditor({ section }: { section: CmsSharedSection<z.infer<typeof sharedExclusiveTalentsSchema>> }) {
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

        <BorderedPanel>
          <SectionTitle>Featured Talent</SectionTitle>
          <TwoColumnGrid>
            <FormField control={form.control} name="featured_name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="featured_handle" render={({ field }) => (
              <FormItem><FormLabel>Handle (e.g. @username)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </TwoColumnGrid>
          <TwoColumnGrid>
            <FormField control={form.control} name="featured_photo" render={({ field }) => (
              <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="featured_photo_alt" render={({ field }) => (
              <FormItem><FormLabel>Photo Alt Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </TwoColumnGrid>
          <FormField control={form.control} name="featured_description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <SectionStack>
            <SectionTitle>Featured Stats (exactly 2 required)</SectionTitle>
            <TwoColumnGrid>
              {statFields.map((item, index) => (
                <ItemCard key={item.id}>
                  <FormField control={form.control} name={`featured_stats.${index}.label`} render={({ field }) => (
                    <FormItem><FormLabel>Stat Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`featured_stats.${index}.value`} render={({ field }) => (
                    <FormItem><FormLabel>Stat Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </ItemCard>
              ))}
            </TwoColumnGrid>
          </SectionStack>
        </BorderedPanel>

        <SectionStack>
          <FormField control={form.control} name="talent_count_label" render={({ field }) => (
            <FormItem><FormLabel>Talent Count Label</FormLabel><FormControl><Input {...field} placeholder="50+ TALENTS" /></FormControl><FormMessage /></FormItem>
          )} />

          <SectionHeaderRow>
            <SectionTitle>Talent Grid List ({talentFields.length})</SectionTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => appendTalent({ name: '', photo: '', photo_alt: '' })}>
              + Add Talent Item
            </Button>
          </SectionHeaderRow>

          {talentFields.map((item, index) => (
            <ItemCard key={item.id}>
              <TwoColumnGrid>
                <FormField control={form.control} name={`talents.${index}.name`} render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <HeaderRow>
                  <FormField control={form.control} name={`talents.${index}.photo`} render={({ field }) => (
                    <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeTalent(index)}>Remove</Button>
                </HeaderRow>
              </TwoColumnGrid>
            </ItemCard>
          ))}
          {form.formState.errors.talents && <ErrorText>{form.formState.errors.talents.message}</ErrorText>}
        </SectionStack>

      </FormStack>
    </Form>
  );
}
