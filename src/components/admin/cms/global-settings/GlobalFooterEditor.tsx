'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Divider, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CmsGlobalSetting, globalFooterSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminCard,
} from '@/components/admin/layout/AdminPrimitives';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';

type FormValues = z.infer<typeof globalFooterSchema> & { enabled: boolean };

interface GlobalFooterEditorProps {
  setting: CmsGlobalSetting<z.infer<typeof globalFooterSchema>>;
  role: string;
  canPublish: boolean;
}

export function GlobalFooterEditor({ setting, role, canPublish }: GlobalFooterEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(globalFooterSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: setting.enabled,
      thank_you_heading: setting.content?.thank_you_heading || '',
      email: setting.content?.email || '',
      address: setting.content?.address || '',
      menu_links: setting.content?.menu_links?.length
        ? setting.content.menu_links
        : [{ label: '', url: '/' }],
      social_links: setting.content?.social_links?.length
        ? setting.content.social_links
        : [{ label: '', url: '#' }],
      brand_watermark: setting.content?.brand_watermark || '',
    },
  });

  const menuLinksArray = useFieldArray({
    control: form.control,
    name: 'menu_links',
  });

  const socialLinksArray = useFieldArray({
    control: form.control,
    name: 'social_links',
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
      await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_FOOTER, payload, enabled);
      setSuccessMsg('Footer draft saved. Changes are not live until publish.');
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
        await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_FOOTER, payload, enabled);
      }

      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_FOOTER);
      setSuccessMsg('Footer published and global routes revalidated.');
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
        pageTitle="Global Footer"
        hasUnpublished={setting.has_unpublished_changes ?? false}
        lastEditedBy={setting.last_edited_by_identifier}
        lastEditedAt={setting.last_edited_at}
        lastPublishedBy={setting.last_published_by_identifier}
        lastPublishedAt={setting.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        publishLabel="Publish Footer"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSaveDraft)}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          <AdminAlert>
            <AdminAlertTitle>Global Impact Warning</AdminAlertTitle>
            <AdminAlertDescription>
              This Footer configuration is shared across multiple pages. Draft first, then publish when you are ready to update site-wide chrome.
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
                    <FormLabel style={{ marginBottom: 0 }}>Enable Footer</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </AdminCard>

          <FormField
            control={form.control}
            name="thank_you_heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thank You Heading</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={120} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={200} showCount />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CmsSortableList
              title={`Menu Links (${menuLinksArray.fields.length})`}
              items={menuLinksArray.fields.map((field, index) => ({ key: field.id, value: index }))}
              onMove={menuLinksArray.move}
              onRemove={menuLinksArray.remove}
              onAdd={() => menuLinksArray.append({ label: '', url: '/' })}
              addLabel="Add Menu Link"
              removeDisabled={(_, total) => total <= 1}
              renderItem={({ item }) => {
                const index = item.value;
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'end' }}>
                <FormField
                  control={form.control}
                  name={`menu_links.${index}.label`}
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
                  name={`menu_links.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={40} showCount />
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CmsSortableList
              title={`Social Links (${socialLinksArray.fields.length})`}
              items={socialLinksArray.fields.map((field, index) => ({ key: field.id, value: index }))}
              onMove={socialLinksArray.move}
              onRemove={socialLinksArray.remove}
              onAdd={() => socialLinksArray.append({ label: '', url: '#' })}
              addLabel="Add Social Link"
              removeDisabled={(_, total) => total <= 1}
              renderItem={({ item }) => {
                const index = item.value;
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'end' }}>
                <FormField
                  control={form.control}
                  name={`social_links.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={500} showCount />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`social_links.${index}.url`}
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

          <FormField
            control={form.control}
            name="brand_watermark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Watermark</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={30} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

const SaveRow = (props: React.ComponentProps<'div'>) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }} {...props} />
);
