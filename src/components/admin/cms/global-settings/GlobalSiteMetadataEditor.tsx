'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Divider, Typography } from 'antd';
import { CmsGlobalSetting, globalSiteMetadataSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { CmsFieldHint } from '@/components/admin/cms/ux/CmsFieldHint';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminCard,
} from '@/components/admin/layout/AdminPrimitives';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';

type FormValues = z.infer<typeof globalSiteMetadataSchema>;

export function GlobalSiteMetadataEditor({
  setting,
  role,
  canPublish,
}: {
  setting: CmsGlobalSetting<z.infer<typeof globalSiteMetadataSchema>>;
  role: string;
  canPublish: boolean;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(globalSiteMetadataSchema),
    defaultValues: {
      site_name: setting.content?.site_name || '3BROTHERS NETWORK',
      site_url: setting.content?.site_url || 'https://3brothers.media',
      default_canonical_base: setting.content?.default_canonical_base || 'https://3brothers.media',
      brand_name: setting.content?.brand_name || '3BROTHERS',
      publisher_name: setting.content?.publisher_name || '3BROTHERS NETWORK',
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
      await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_SITE_METADATA, values, setting.enabled);
      setSuccessMsg('Site metadata draft saved. Changes are not live until publish.');
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
      if (form.formState.isDirty || !setting.id) {
        await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_SITE_METADATA, values, setting.enabled);
      }
      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_SITE_METADATA);
      setSuccessMsg('Site metadata published and metadata routes revalidated.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  const ux = (fieldPath: string) => getCmsFieldUxSpec('global_site_metadata', fieldPath);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CmsEditorStatusBar
        pageTitle="Global Site Metadata"
        hasUnpublished={setting.has_unpublished_changes ?? false}
        lastEditedBy={setting.last_edited_by_identifier}
        lastEditedAt={setting.last_edited_at}
        lastPublishedBy={setting.last_published_by_identifier}
        lastPublishedAt={setting.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        publishLabel="Publish Site Metadata"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSaveDraft)}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          <AdminAlert>
            <AdminAlertTitle>Global Metadata Impact</AdminAlertTitle>
            <AdminAlertDescription>
              Site metadata controls metadata base URL, canonical base, and brand identity defaults used by CMS-driven pages.
            </AdminAlertDescription>
          </AdminAlert>

          {errorMsg && (
            <AdminAlert tone="destructive">
              <AdminAlertDescription>{errorMsg}</AdminAlertDescription>
            </AdminAlert>
          )}

          {successMsg && (
            <AdminAlert>
              <AdminAlertDescription>{successMsg}</AdminAlertDescription>
            </AdminAlert>
          )}

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

          <FormField control={form.control} name="site_name" render={({ field }) => (
            <FormItem><FormLabel>Site Name</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
          )} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <FormField control={form.control} name="site_url" render={({ field }) => (
              <FormItem>
                <FormLabel>{ux('site_url').label ?? 'Site URL'}</FormLabel>
                <FormControl><Input {...field} maxLength={500} showCount /></FormControl>
                <CmsFieldHint formId="global_site_metadata" fieldPath="site_url" />
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_canonical_base" render={({ field }) => (
              <FormItem>
                <FormLabel>{ux('default_canonical_base').label ?? 'Default Canonical Base'}</FormLabel>
                <FormControl><Input {...field} maxLength={500} showCount /></FormControl>
                <CmsFieldHint formId="global_site_metadata" fieldPath="default_canonical_base" />
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <FormField control={form.control} name="brand_name" render={({ field }) => (
              <FormItem><FormLabel>Brand Name</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="publisher_name" render={({ field }) => (
              <FormItem><FormLabel>Publisher Name</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
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
