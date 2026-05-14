'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, socialCommerceHeroSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ItemCard, SectionStack, SectionTitle, ToggleFormItem, TwoColumnGrid } from './EditorLayout';
import { z } from 'zod';

type FormValues = z.infer<typeof socialCommerceHeroSchema> & { enabled: boolean };
type ServiceId = FormValues['services'][number]['id'];

const SERVICE_IDS: ServiceId[] = ['live_commerce', 'affiliate_marketing', 'kol_marketplace', 'bio_link', 'brand_partnerships'];
const SERVICE_LABELS: Record<ServiceId, string> = {
  live_commerce: 'Live Commerce',
  affiliate_marketing: 'Affiliate Marketing',
  kol_marketplace: 'KOL Marketplace',
  bio_link: 'Bio Link',
  brand_partnerships: 'Brand Partnerships',
};

export function SocialCommerceHeroEditor({ pageId, section }: { pageId: string; section: CmsPageSection<z.infer<typeof socialCommerceHeroSchema>> }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const parsed = socialCommerceHeroSchema.safeParse(section.content);
  const content = parsed.success ? parsed.data : null;
  const byId = new Map((content?.services ?? []).map((item) => [item.id, item]));

  const form = useForm<FormValues>({
    resolver: zodResolver(socialCommerceHeroSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      eyebrow: content?.eyebrow ?? '',
      title: content?.title ?? '',
      subtitle: content?.subtitle ?? '',
      services: SERVICE_IDS.map((id) => ({ id, label: byId.get(id)?.label ?? SERVICE_LABELS[id] })),
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: 'services' });

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
        {success && <Alert variant="success"><AlertDescription>Social Commerce Hero saved successfully.</AlertDescription></Alert>}

        <HeaderRow>
          <FormField control={form.control} name="enabled" render={({ field }) => (
            <ToggleFormItem>
              <FormLabel>Enable Section</FormLabel>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </ToggleFormItem>
          )} />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>{isSaving ? 'Saving...' : 'Save Section'}</Button>
        </HeaderRow>

        <TwoColumnGrid>
          <FormField control={form.control} name="eyebrow" render={({ field }) => (
            <FormItem><FormLabel>Eyebrow</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} maxLength={120} showCount /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <FormField control={form.control} name="subtitle" render={({ field }) => (
          <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} rows={3} maxLength={300} showCount /></FormControl><FormMessage /></FormItem>
        )} />

        <SectionStack>
          <SectionTitle>Services (Fixed 5)</SectionTitle>
          {fields.map((item, index) => (
            <ItemCard key={item.id}>
              <TwoColumnGrid>
                <FormField control={form.control} name={`services.${index}.id`} render={({ field }) => (
                  <FormItem><FormLabel>Service Key</FormLabel><FormControl><Input {...field} readOnly /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name={`services.${index}.label`} render={({ field }) => (
                  <FormItem><FormLabel>Service Label</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
                )} />
              </TwoColumnGrid>
            </ItemCard>
          ))}
        </SectionStack>
      </FormStack>
    </Form>
  );
}
