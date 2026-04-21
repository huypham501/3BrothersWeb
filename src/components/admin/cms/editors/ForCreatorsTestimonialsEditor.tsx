'use client';

import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, forCreatorsTestimonialsSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { CmsFieldHint } from '@/components/admin/cms/ux/CmsFieldHint';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';
import {
  FooterRow,
  FormStack,
  HeaderRow,
  ItemCard,
  SectionHeaderRow,
  SectionStack,
  SectionTitle,
  ToggleFormItem,
  TwoColumnGrid,
} from './EditorLayout';
import { z } from 'zod';

type FormValues = z.infer<typeof forCreatorsTestimonialsSchema> & { enabled: boolean };

export function ForCreatorsTestimonialsEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof forCreatorsTestimonialsSchema>> }) {
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

  const ux = (fieldPath: string) => getCmsFieldUxSpec('for_creators_testimonials', fieldPath);

  return (
    <Form {...form}>
      <FormStack onSubmit={form.handleSubmit(onSubmit)}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>For Creators Testimonials saved successfully.</AlertDescription></Alert>}

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

        <TwoColumnGrid>
          <FormField control={form.control} name="superlabel" render={({ field }) => (
            <FormItem>
              <FormLabel>{ux('superlabel').label ?? 'Superlabel'}</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <CmsFieldHint formId="for_creators_testimonials" fieldPath="superlabel" />
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="section_title" render={({ field }) => (
            <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <SectionStack>
          <SectionHeaderRow>
            <SectionTitle>Testimonials ({fields.length})</SectionTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ quote: '', name: '', role: '' })}>
              + Add Testimonial
            </Button>
          </SectionHeaderRow>
          {fields.map((item, index) => (
            <ItemCard key={item.id}>
              <FormField control={form.control} name={`testimonials.${index}.quote`} render={({ field }) => (
                <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
              )} />
              <TwoColumnGrid>
                <FormField control={form.control} name={`testimonials.${index}.name`} render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`testimonials.${index}.role`} render={({ field }) => (
                  <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </TwoColumnGrid>
              <FooterRow>
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} disabled={fields.length <= 1}>
                  Remove
                </Button>
              </FooterRow>
            </ItemCard>
          ))}
        </SectionStack>
      </FormStack>
    </Form>
  );
}
