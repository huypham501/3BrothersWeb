'use client';

import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, forCreatorsBenefitSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import {
  FormStack,
  HeaderRow,
  ItemCard,
  SectionStack,
  SectionTitle,
  ToggleFormItem,
  TwoColumnGrid,
} from './EditorLayout';
import { z } from 'zod';

type FormValues = z.infer<typeof forCreatorsBenefitSchema> & { enabled: boolean };

const BENEFIT_IDS: Array<FormValues['benefits'][number]['id']> = ['income', 'brand', 'management', 'content'];

export function ForCreatorsBenefitEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof forCreatorsBenefitSchema>> }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const parsedContent = forCreatorsBenefitSchema.safeParse(section.content);
  const content = parsedContent.success ? parsedContent.data : null;

  const defaults = content?.benefits?.length
    ? content.benefits
    : BENEFIT_IDS.map((id) => ({ id, title: '', description: '' }));

  const form = useForm<FormValues>({
    resolver: zodResolver(forCreatorsBenefitSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: content?.section_title || '',
      section_description: content?.section_description || '',
      contact_cta_label: content?.contact_cta_label || '',
      contact_cta_url: content?.contact_cta_url || '/contact',
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
      <FormStack onSubmit={form.handleSubmit(onSubmit)}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>For Creators Benefit saved successfully.</AlertDescription></Alert>}

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

        <FormField control={form.control} name="section_title" render={({ field }) => (
          <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="section_description" render={({ field }) => (
          <FormItem><FormLabel>Section Description</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
        )} />

        <TwoColumnGrid>
          <FormField control={form.control} name="contact_cta_label" render={({ field }) => (
            <FormItem><FormLabel>Contact Button Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="contact_cta_url" render={({ field }) => (
            <FormItem><FormLabel>Contact Button URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <SectionStack>
          <SectionTitle>Benefits</SectionTitle>
          {fields.map((item, index) => (
            <ItemCard key={item.id}>
              <FormField control={form.control} name={`benefits.${index}.id`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefit Key</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly />
                  </FormControl>
                </FormItem>
              )} />

              <TwoColumnGrid>
                <FormField control={form.control} name={`benefits.${index}.title`} render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`benefits.${index}.description`} render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                )} />
              </TwoColumnGrid>
            </ItemCard>
          ))}
        </SectionStack>
      </FormStack>
    </Form>
  );
}
