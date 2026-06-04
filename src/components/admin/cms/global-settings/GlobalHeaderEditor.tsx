'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsGlobalSetting, globalHeaderSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminImageUpload } from '@/components/admin/controls/AdminImageUpload';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { Button, Divider, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminCard,
} from '@/components/admin/layout/AdminPrimitives';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';
import { CmsActionFeedback, useCmsActionFeedback } from '@/components/admin/cms/CmsActionFeedback';
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';

type FormValues = z.infer<typeof globalHeaderSchema> & { enabled: boolean };

interface GlobalHeaderEditorProps {
  setting: CmsGlobalSetting<z.infer<typeof globalHeaderSchema>>;
  role: string;
  canPublish: boolean;
}

export function GlobalHeaderEditor({ setting, role, canPublish }: GlobalHeaderEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const { feedback, showSuccess, showError, clearFeedback } = useCmsActionFeedback();

  const form = useForm<FormValues>({
    resolver: zodResolver(globalHeaderSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: setting.enabled,
      logo_text: setting.content?.logo_text || '',
      logo_image: setting.content?.logo_image || '',
      nav_links: setting.content?.nav_links?.length
        ? setting.content.nav_links
        : [{ label: '', url: '/' }],
      cta_label: setting.content?.cta_label || '',
      cta_url: setting.content?.cta_url || '/',
    },
  });

  const navLinksArray = useFieldArray({
    control: form.control,
    name: 'nav_links',
  });

  const onSaveDraft = async (values: FormValues) => {
    setIsSaving(true);
    clearFeedback();

    try {
      const { enabled, ...payload } = values;
      await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_HEADER, payload, enabled);
      showSuccess('Header draft saved. Changes are not live until publish.');
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
      if (form.formState.isDirty) {
        const { enabled, ...payload } = values;
        await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_HEADER, payload, enabled);
      }

      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_HEADER);
      showSuccess('Header published and global routes revalidated.');
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
        pageTitle="Global Header"
        hasUnpublished={setting.has_unpublished_changes ?? false}
        lastEditedBy={setting.last_edited_by_identifier}
        lastEditedAt={setting.last_edited_at}
        lastPublishedBy={setting.last_published_by_identifier}
        lastPublishedAt={setting.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        publishLabel="Publish Header"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSaveDraft)}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          <AdminAlert>
            <AdminAlertTitle>Global Impact Warning</AdminAlertTitle>
            <AdminAlertDescription>
              This Header configuration is shared across multiple pages.
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

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <FormLabel style={{ marginBottom: 0 }}>Enable Header</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </AdminCard>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          <FormField
            control={form.control}
            name="logo_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo Text</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={20} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo Image</FormLabel>
                <FormControl>
                  <AdminImageUpload
                    value={field.value}
                    onChange={(nextUrl) => {
                      form.setValue('logo_image', nextUrl, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                    label="Logo Image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CmsSortableList
              title={`Navigation Links (${navLinksArray.fields.length})`}
              items={navLinksArray.fields.map((field, index) => ({ key: field.id, value: index }))}
              onMove={navLinksArray.move}
              onRemove={navLinksArray.remove}
              onAdd={() => navLinksArray.append({ label: '', url: '/' })}
              addLabel="Add Link"
              removeDisabled={(_, total) => total <= 1}
              renderItem={({ item }) => {
                const index = item.value;
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'end' }}>
              <FormField
                control={form.control}
                name={`nav_links.${index}.label`}
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
                name={`nav_links.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={500} showCount />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  </div>
                );
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          <FormField
            control={form.control}
            name="cta_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Label</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={30} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cta_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA URL</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={500} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </form>
      </Form>
    </div>
  );
}

const SaveRow = (props: React.ComponentProps<'div'>) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }} {...props} />
);
