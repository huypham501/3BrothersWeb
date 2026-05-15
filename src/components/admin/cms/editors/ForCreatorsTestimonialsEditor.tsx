'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';
import {
  FormStack,
  HeaderRow,
  SectionStack,
  ToggleFormItem,
  TwoColumnGrid,
} from './EditorLayout';
import { z } from 'zod';

type FormValues = z.infer<typeof forCreatorsTestimonialsSchema> & { enabled: boolean };

export function ForCreatorsTestimonialsEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof forCreatorsTestimonialsSchema>> }) {
  const router = useRouter();
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

  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: 'testimonials' });

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
      router.refresh();
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
              <FormControl><Input {...field} maxLength={120} showCount /></FormControl>
              <CmsFieldHint formId="for_creators_testimonials" fieldPath="superlabel" />
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="section_title" render={({ field }) => (
            <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <SectionStack>
          <CmsSortableList
            title={`Testimonials (${fields.length})`}
            items={fields.map((item, index) => ({ key: item.id, value: index }))}
            onMove={move}
            onRemove={remove}
            onAdd={() => append({ quote: '', name: '', role: '' })}
            addLabel="Add Testimonial"
            removeDisabled={(_, total) => total <= 1}
            renderItem={({ item }) => {
              const index = item.value;
              return (
                <>
              <FormField control={form.control} name={`testimonials.${index}.quote`} render={({ field }) => (
                <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} rows={3} maxLength={400} showCount /></FormControl><FormMessage /></FormItem>
              )} />
              <TwoColumnGrid>
                <FormField control={form.control} name={`testimonials.${index}.name`} render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} maxLength={60} showCount /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`testimonials.${index}.role`} render={({ field }) => (
                  <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
                )} />
              </TwoColumnGrid>
                </>
              );
            }}
          />
        </SectionStack>
      </FormStack>
    </Form>
  );
}
