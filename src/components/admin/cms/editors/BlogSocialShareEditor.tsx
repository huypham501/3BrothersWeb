'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Divider, Select, Typography } from 'antd';
import { globalBlogSocialShareSchema, SCHEMA_KEYS } from '@/lib/cms';
import type { CmsGlobalSetting, GlobalBlogSocialSharePayload } from '@/lib/cms';
import { DEFAULT_BLOG_SOCIAL_SHARE } from '@/lib/cms/blog-social-share';
import { publishGlobalSetting, saveGlobalSettingDraft } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminCard,
} from '@/components/admin/layout/AdminPrimitives';
import { CmsActionFeedback, useCmsActionFeedback } from '@/components/admin/cms/CmsActionFeedback';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';

type FormValues = z.infer<typeof globalBlogSocialShareSchema>;

interface BlogSocialShareEditorProps {
  setting: CmsGlobalSetting<GlobalBlogSocialSharePayload> | null;
  role: string;
  canPublish: boolean;
}

const PLATFORM_OPTIONS = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'X', value: 'x' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
];

function getDefaultValues(setting: CmsGlobalSetting<GlobalBlogSocialSharePayload> | null): FormValues {
  return {
    enabled: setting?.content?.enabled ?? DEFAULT_BLOG_SOCIAL_SHARE.enabled,
    platforms: setting?.content?.platforms?.length
      ? setting.content.platforms
      : DEFAULT_BLOG_SOCIAL_SHARE.platforms,
  };
}

export function BlogSocialShareEditor({ setting, role, canPublish }: BlogSocialShareEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const { feedback, showSuccess, showError, clearFeedback } = useCmsActionFeedback();

  const form = useForm<FormValues>({
    resolver: zodResolver(globalBlogSocialShareSchema),
    defaultValues: getDefaultValues(setting),
  });

  const platformsArray = useFieldArray({
    control: form.control,
    name: 'platforms',
  });

  const onSaveDraft = async (values: FormValues) => {
    setIsSaving(true);
    clearFeedback();

    try {
      await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_BLOG_SOCIAL_SHARE, values, true);
      showSuccess('Blog social share draft saved. Changes are not live until publish.');
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
      if (!setting || form.formState.isDirty) {
        await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_BLOG_SOCIAL_SHARE, values, true);
      }

      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_BLOG_SOCIAL_SHARE);
      showSuccess('Blog social share published.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      showError(error, 'Failed to publish. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CmsEditorStatusBar
        pageTitle="Blog Social Share"
        hasUnpublished={setting?.has_unpublished_changes ?? false}
        lastEditedBy={setting?.last_edited_by_identifier}
        lastEditedAt={setting?.last_edited_at}
        lastPublishedBy={setting?.last_published_by_identifier}
        lastPublishedAt={setting?.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        publishLabel="Publish Social Share"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSaveDraft)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AdminAlert>
            <AdminAlertTitle>Blog Detail Impact</AdminAlertTitle>
            <AdminAlertDescription>
              This controls the social share sidebar on all blog detail pages.
            </AdminAlertDescription>
          </AdminAlert>

          <CmsActionFeedback feedback={feedback} />

          <AdminCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
              <div>
                <Typography.Text strong>Enable social share sidebar</Typography.Text>
                <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                  Disable to hide the entire icon stack on blog detail pages.
                </Typography.Text>
              </div>
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem style={{ marginBottom: 0 }}>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" htmlType="submit" loading={isSaving} disabled={!form.formState.isDirty}>
                Save Draft
              </Button>
            </div>
          </AdminCard>

          <CmsSortableList
            title={`Platforms (${platformsArray.fields.length})`}
            items={platformsArray.fields.map((field, index) => ({ key: field.id, value: index }))}
            onMove={platformsArray.move}
            onRemove={platformsArray.remove}
            onAdd={() => platformsArray.append({
              id: 'linkedin',
              label: 'LinkedIn',
              enabled: true,
              url_template: 'https://www.linkedin.com/sharing/share-offsite/?url={url}',
            })}
            addLabel="Add Platform"
            removeDisabled={(_, total) => total <= 1}
            renderItem={({ item }) => {
              const index = item.value;
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 2fr 88px', gap: 16, alignItems: 'end' }}>
                  <FormField
                    control={form.control}
                    name={`platforms.${index}.id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <FormControl>
                          <Select options={PLATFORM_OPTIONS} value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`platforms.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={40} showCount />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`platforms.${index}.url_template`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Template</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://...?u={url}&text={title}" maxLength={500} showCount />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`platforms.${index}.enabled`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enabled</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            }}
          />
        </form>
      </Form>
    </div>
  );
}
