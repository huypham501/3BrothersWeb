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
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

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

  const clearFlash = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const onSaveDraft = async (values: FormValues) => {
    setIsSaving(true);
    clearFlash();

    try {
      const { enabled, ...payload } = values;
      await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_HEADER, payload, enabled);
      setSuccessMsg('Header draft saved. Changes are not live until publish.');
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
        const { enabled, ...payload } = values;
        await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_HEADER, payload, enabled);
      }

      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_HEADER);
      setSuccessMsg('Header published and global routes revalidated.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      setErrorMsg((error as Error).message);
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
              This Header configuration is shared across multiple pages. Draft first, then publish when you are ready to update site-wide chrome.
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
                    onChange={field.onChange}
                    label="Logo Image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>Navigation Links</Typography.Title>
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => navLinksArray.append({ label: '', url: '/' })}
              disabled={navLinksArray.fields.length >= 8}
            >
              Add Link
            </Button>
            </div>

          {navLinksArray.fields.map((field, index) => (
            <AdminCard key={field.id} bodyStyle={{ padding: '12px 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
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

              <div style={{ paddingBottom: 4 }}>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => navLinksArray.remove(index)}
                  disabled={navLinksArray.fields.length <= 1}
                />
              </div>
              </div>
            </AdminCard>
          ))}
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
