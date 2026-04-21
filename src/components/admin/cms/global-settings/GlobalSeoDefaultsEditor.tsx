'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsGlobalSetting, globalSeoDefaultsSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminImageUpload } from '@/components/admin/controls/AdminImageUpload';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminButton,
} from '@/components/admin/layout/AdminPrimitives';
import { SelectInput } from '@/components/admin/cms/editors/EditorLayout';
import { CmsFieldHint } from '@/components/admin/cms/ux/CmsFieldHint';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';

type FormValues = z.infer<typeof globalSeoDefaultsSchema>;

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export function GlobalSeoDefaultsEditor({
  setting,
  role,
  canPublish,
}: {
  setting: CmsGlobalSetting<z.infer<typeof globalSeoDefaultsSchema>>;
  role: string;
  canPublish: boolean;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(globalSeoDefaultsSchema),
    defaultValues: {
      default_title_template: setting.content?.default_title_template || '{{page_title}} | {{brand_name}}',
      default_meta_description: setting.content?.default_meta_description || '',
      default_keywords: setting.content?.default_keywords || [],
      default_og_image: setting.content?.default_og_image || '/3brothers.png',
      default_og_image_alt: setting.content?.default_og_image_alt || '3BROTHERS NETWORK',
      default_twitter_card_type: setting.content?.default_twitter_card_type || 'summary_large_image',
      default_robots: setting.content?.default_robots || 'index,follow',
    },
  });

  const clearFlash = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const onSaveDraft = async (values: FormValues) => {
    setIsSaving(true);
    clearFlash();
    try {
      await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS, values, setting.enabled);
      setSuccessMsg('SEO defaults draft saved. Changes are not live until publish.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    clearFlash();
    try {
      const values = form.getValues();
      if (form.formState.isDirty) {
        await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS, values, setting.enabled);
      }
      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS);
      setSuccessMsg('SEO defaults published and metadata routes revalidated.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  const ux = (fieldPath: string) => getCmsFieldUxSpec('global_seo_defaults', fieldPath);

  return (
    <Form {...form}>
      <FormRoot onSubmit={form.handleSubmit(onSaveDraft)}>
        <AdminAlert>
          <AdminAlertTitle>Global Metadata Impact</AdminAlertTitle>
          <AdminAlertDescription>
            SEO defaults affect metadata fallback across CMS-driven pages. Draft changes are safe until publish.
          </AdminAlertDescription>
        </AdminAlert>

        {errorMsg && <AdminAlert tone="destructive"><AdminAlertDescription>{errorMsg}</AdminAlertDescription></AdminAlert>}
        {successMsg && <AdminAlert><AdminAlertDescription>{successMsg}</AdminAlertDescription></AdminAlert>}

        <SectionCard>
          <ActionHeader>
            <BadgeRow>
              <AdminBadge>{setting.schema_key}</AdminBadge>
              <AdminBadge tone={setting.published_enabled ? 'success' : 'neutral'}>
                {setting.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
              </AdminBadge>
              <AdminBadge tone={setting.has_unpublished_changes ? 'warning' : 'neutral'}>
                {setting.has_unpublished_changes ? 'Has Unpublished Changes' : 'No Unpublished Changes'}
              </AdminBadge>
            </BadgeRow>
            <MetaText>Your role: {role}</MetaText>
            <MetaText>
              Last edited: {setting.last_edited_by_identifier ?? 'N/A'} at {formatAuditDate(setting.last_edited_at)}
            </MetaText>
            <MetaText>
              Last published: {setting.last_published_by_identifier ?? 'N/A'} at {formatAuditDate(setting.last_published_at)}
            </MetaText>
            <ButtonGroup>
              <AdminButton type="submit" variant="outline" disabled={isSaving || isPublishing || !form.formState.isDirty}>
                {isSaving ? 'Saving Draft...' : 'Save Draft'}
              </AdminButton>
              <AdminButton
                type="button"
                onClick={handlePublish}
                disabled={isSaving || isPublishing || !canPublish}
                title={canPublish ? undefined : 'Your role cannot publish.'}
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </AdminButton>
            </ButtonGroup>
          </ActionHeader>
          <Divider />
          <ScopeText>Revalidation scope: `/`, `/for-creators`</ScopeText>
        </SectionCard>

        <FormField control={form.control} name="default_title_template" render={({ field }) => (
          <FormItem>
            <FormLabel>Default Title Template</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <MetaText>
              Supported placeholders: <code>{'{{page_title}}'}</code>, <code>{'{{site_name}}'}</code>, <code>{'{{brand_name}}'}</code>
            </MetaText>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="default_meta_description" render={({ field }) => (
          <FormItem><FormLabel>Default Meta Description</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField
          control={form.control}
          name="default_keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Keywords (comma separated)</FormLabel>
              <FormControl>
                <Input
                  value={field.value?.join(', ') || ''}
                  onChange={(e) => {
                    const vals = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    field.onChange(vals);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TwoColumnGrid>
          <FormField control={form.control} name="default_og_image" render={({ field }) => (
            <FormItem><FormLabel>Default OG Image</FormLabel><FormControl>
              <AdminImageUpload value={field.value} onChange={field.onChange} label="Default OG Image" />
            </FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="default_og_image_alt" render={({ field }) => (
            <FormItem><FormLabel>Default OG Image Alt</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <TwoColumnGrid>
          <FormField control={form.control} name="default_twitter_card_type" render={({ field }) => (
            <FormItem>
              <FormLabel>Default Twitter Card Type</FormLabel>
              <FormControl>
                <SelectInput
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                </SelectInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="default_robots" render={({ field }) => (
            <FormItem>
              <FormLabel>{ux('default_robots').label ?? 'Default Robots'}</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <CmsFieldHint formId="global_seo_defaults" fieldPath="default_robots" />
              <FormMessage />
            </FormItem>
          )} />
        </TwoColumnGrid>
      </FormRoot>
    </Form>
  );
}

const FormRoot = (props: React.ComponentProps<'form'>) => <form {...props} />;
const SectionCard = (props: React.ComponentProps<'div'>) => <div {...props} />;
const ActionHeader = (props: React.ComponentProps<'div'>) => <div {...props} />;
const BadgeRow = (props: React.ComponentProps<'div'>) => <div {...props} />;
const MetaText = (props: React.ComponentProps<'p'>) => <p {...props} />;
const ButtonGroup = (props: React.ComponentProps<'div'>) => <div {...props} />;
const Divider = (props: React.ComponentProps<'hr'>) => <hr {...props} />;
const ScopeText = (props: React.ComponentProps<'p'>) => <p {...props} />;
const TwoColumnGrid = (props: React.ComponentProps<'div'>) => <div {...props} />;
