'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Divider, Typography } from 'antd';
import { CmsGlobalSetting, globalSeoDefaultsSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminImageUpload } from '@/components/admin/controls/AdminImageUpload';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminCard,
} from '@/components/admin/layout/AdminPrimitives';
import { SelectInput } from '@/components/admin/cms/editors/EditorLayout';
import { CmsFieldHint } from '@/components/admin/cms/ux/CmsFieldHint';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';
import { CmsActionFeedback, useCmsActionFeedback } from '@/components/admin/cms/CmsActionFeedback';

type FormValues = z.infer<typeof globalSeoDefaultsSchema>;

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
  const { feedback, showSuccess, showError, clearFeedback } = useCmsActionFeedback();

  const form = useForm<FormValues>({
    resolver: zodResolver(globalSeoDefaultsSchema),
    defaultValues: {
      default_title_template: setting.content?.default_title_template || '{{page_title}} | {{brand_name}}',
      default_meta_description: setting.content?.default_meta_description || '',
      default_keywords: setting.content?.default_keywords || [],
      default_og_image: setting.content?.default_og_image || '/3brothers-512x512.png',
      default_og_image_alt: setting.content?.default_og_image_alt || '3BROTHERS NETWORK',
      default_twitter_card_type: setting.content?.default_twitter_card_type || 'summary_large_image',
      default_robots: setting.content?.default_robots || 'index,follow',
    },
  });

  const onSaveDraft = async (values: FormValues) => {
    setIsSaving(true);
    clearFeedback();
    try {
      await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS, values, setting.enabled);
      showSuccess('SEO defaults draft saved. Changes are not live until publish.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      showError(error, 'Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    clearFeedback();
    try {
      const values = form.getValues();
      if (form.formState.isDirty || !setting.id) {
        await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS, values, setting.enabled);
      }
      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS);
      showSuccess('SEO defaults published and metadata routes revalidated.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      showError(error, 'Failed to publish. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const ux = (fieldPath: string) => getCmsFieldUxSpec('global_seo_defaults', fieldPath);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CmsEditorStatusBar
        pageTitle="Global SEO Defaults"
        hasUnpublished={setting.has_unpublished_changes ?? false}
        lastEditedBy={setting.last_edited_by_identifier}
        lastEditedAt={setting.last_edited_at}
        lastPublishedBy={setting.last_published_by_identifier}
        lastPublishedAt={setting.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        publishLabel="Publish SEO Defaults"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSaveDraft)}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          <AdminAlert>
            <AdminAlertTitle>Global Metadata Impact</AdminAlertTitle>
            <AdminAlertDescription>
              SEO defaults affect metadata fallback across CMS-driven pages. Draft changes are safe until publish.
            </AdminAlertDescription>
          </AdminAlert>

          <CmsActionFeedback feedback={feedback} />

          <AdminCard>
            <SaveRow>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSaving}
                disabled={!form.formState.isDirty}
              >
                Save Draft
              </Button>
            </SaveRow>
            <Divider style={{ margin: '12px 0' }} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>Revalidation scope: `/`, `/for-creators`</Typography.Text>
          </AdminCard>

          <FormField control={form.control} name="default_title_template" render={({ field }) => (
            <FormItem>
              <FormLabel>Default Title Template</FormLabel>
              <FormControl><Input {...field} maxLength={120} showCount /></FormControl>
              <FormDescription>
                Supported placeholders: <code>{'{{page_title}}'}</code>, <code>{'{{site_name}}'}</code>, <code>{'{{brand_name}}'}</code>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="default_meta_description" render={({ field }) => (
            <FormItem><FormLabel>Default Meta Description</FormLabel><FormControl><Textarea {...field} rows={4} maxLength={160} showCount /></FormControl><FormMessage /></FormItem>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <FormField control={form.control} name="default_og_image" render={({ field }) => (
              <FormItem><FormLabel>Default OG Image</FormLabel><FormControl>
                <AdminImageUpload
                  value={field.value}
                  onChange={(nextUrl) => {
                    form.setValue('default_og_image', nextUrl, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }}
                  label="Default OG Image"
                />
              </FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="default_og_image_alt" render={({ field }) => (
              <FormItem><FormLabel>Default OG Image Alt</FormLabel><FormControl><Input {...field} maxLength={125} showCount /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <FormField control={form.control} name="default_twitter_card_type" render={({ field }) => (
              <FormItem>
                <FormLabel>Default Twitter Card Type</FormLabel>
                <FormControl>
                  <SelectInput
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={[
                      { label: 'summary', value: 'summary' },
                      { label: 'summary_large_image', value: 'summary_large_image' },
                    ]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_robots" render={({ field }) => (
              <FormItem>
                <FormLabel>{ux('default_robots').label ?? 'Default Robots'}</FormLabel>
                <FormControl><Input {...field} maxLength={80} showCount /></FormControl>
                <CmsFieldHint formId="global_seo_defaults" fieldPath="default_robots" />
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </form>
      </Form>
    </div>
  );
}

const SaveRow = (props: React.ComponentProps<'div'>) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }} {...props} />
);
