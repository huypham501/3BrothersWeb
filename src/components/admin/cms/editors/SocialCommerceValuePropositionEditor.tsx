'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, socialCommerceValuePropositionSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ItemCard, SectionStack, SectionTitle, ToggleFormItem, TwoColumnGrid } from './EditorLayout';
import { z } from 'zod';

type FormValues = z.infer<typeof socialCommerceValuePropositionSchema> & { enabled: boolean };
type PropId = FormValues['items'][number]['id'];

const PROP_IDS: PropId[] = ['diversification', 'connection', 'income'];
const PROP_DEFAULTS: Record<PropId, { number: string; title: string }> = {
  diversification: { number: '01', title: 'Đa dạng hoá' },
  connection: { number: '02', title: 'Kết nối' },
  income: { number: '03', title: 'Thu nhập đa dạng' },
};

export function SocialCommerceValuePropositionEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof socialCommerceValuePropositionSchema>> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const parsed = socialCommerceValuePropositionSchema.safeParse(section.content);
  const content = parsed.success ? parsed.data : null;
  const byId = new Map((content?.items ?? []).map((item) => [item.id, item]));

  const form = useForm<FormValues>({
    resolver: zodResolver(socialCommerceValuePropositionSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: content?.section_title ?? '',
      section_subtitle: content?.section_subtitle ?? '',
      items: PROP_IDS.map((id) => ({
        id,
        number: byId.get(id)?.number ?? PROP_DEFAULTS[id].number,
        title: byId.get(id)?.title ?? PROP_DEFAULTS[id].title,
        description: byId.get(id)?.description ?? '',
      })),
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: 'items' });

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

  return (
    <Form {...form}>
      <FormStack onSubmit={form.handleSubmit(onSubmit)}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Social Commerce Value Proposition saved successfully.</AlertDescription></Alert>}

        <HeaderRow>
          <FormField control={form.control} name="enabled" render={({ field }) => (
            <ToggleFormItem>
              <FormLabel>Enable Section</FormLabel>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </ToggleFormItem>
          )} />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>{isSaving ? 'Saving...' : 'Save Section'}</Button>
        </HeaderRow>

        <FormField control={form.control} name="section_title" render={({ field }) => (
          <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="section_subtitle" render={({ field }) => (
          <FormItem><FormLabel>Section Subtitle</FormLabel><FormControl><Textarea {...field} rows={3} maxLength={300} showCount /></FormControl><FormMessage /></FormItem>
        )} />

        <SectionStack>
          <SectionTitle>Value Items (Fixed 3)</SectionTitle>
          {fields.map((item, index) => (
            <ItemCard key={item.id}>
              <TwoColumnGrid>
                <FormField control={form.control} name={`items.${index}.id`} render={({ field }) => (
                  <FormItem><FormLabel>Item Key</FormLabel><FormControl><Input {...field} readOnly /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.number`} render={({ field }) => (
                  <FormItem><FormLabel>Number</FormLabel><FormControl><Input {...field} maxLength={10} showCount /></FormControl><FormMessage /></FormItem>
                )} />
              </TwoColumnGrid>
              <TwoColumnGrid>
                <FormField control={form.control} name={`items.${index}.title`} render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} maxLength={300} showCount /></FormControl><FormMessage /></FormItem>
                )} />
              </TwoColumnGrid>
            </ItemCard>
          ))}
        </SectionStack>
      </FormStack>
    </Form>
  );
}
