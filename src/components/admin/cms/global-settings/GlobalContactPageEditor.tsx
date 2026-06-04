'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Divider, Typography } from 'antd';
import { CmsGlobalSetting, globalContactPageSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { DEFAULT_CONTACT_PAGE_CONFIG } from '@/lib/contact/contact-page-config';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminCard,
} from '@/components/admin/layout/AdminPrimitives';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';

const editorSchema = z.intersection(globalContactPageSchema, z.object({ enabled: z.boolean() }));

type FormValues = z.infer<typeof globalContactPageSchema> & { enabled: boolean };
type FieldKey = keyof FormValues['fields'];

interface GlobalContactPageEditorProps {
  setting: CmsGlobalSetting<z.infer<typeof globalContactPageSchema>>;
  role: string;
  canPublish: boolean;
}

export function GlobalContactPageEditor({ setting, role, canPublish }: GlobalContactPageEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      enabled: setting.enabled,
      ...DEFAULT_CONTACT_PAGE_CONFIG,
      ...setting.content,
      fields: {
        ...DEFAULT_CONTACT_PAGE_CONFIG.fields,
        ...setting.content?.fields,
      },
    },
  });

  const clearFlash = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const saveValues = async (values: FormValues) => {
    const { enabled, ...payload } = values;
    await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_CONTACT_PAGE, payload, enabled);
  };

  const onSaveDraft = async (values: FormValues) => {
    setIsSaving(true);
    clearFlash();

    try {
      await saveValues(values);
      setSuccessMsg('Contact page draft saved. Changes are not live until publish.');
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
        await saveValues(values);
      }

      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_CONTACT_PAGE);
      setSuccessMsg('Contact page settings published.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  const renderFieldConfig = (fieldKey: FieldKey, title: string) => (
    <AdminCard key={fieldKey}>
      <Typography.Title level={4} style={{ marginTop: 0 }}>{title}</Typography.Title>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
        <FormField
          control={form.control}
          name={`fields.${fieldKey}.enabled`}
          render={({ field }) => (
            <FormItem>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <FormLabel>Render on public form</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`fields.${fieldKey}.required`}
          render={({ field }) => (
            <FormItem>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <FormLabel>Required on public form</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`fields.${fieldKey}.label`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} maxLength={60} showCount />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`fields.${fieldKey}.placeholder`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} maxLength={80} showCount />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </AdminCard>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CmsEditorStatusBar
        pageTitle="Contact Page"
        hasUnpublished={setting.has_unpublished_changes ?? false}
        lastEditedBy={setting.last_edited_by_identifier}
        lastEditedAt={setting.last_edited_at}
        lastPublishedBy={setting.last_published_by_identifier}
        lastPublishedAt={setting.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        publishLabel="Publish Contact Page"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSaveDraft)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AdminAlert>
            <AdminAlertTitle>Contact Mail Flow</AdminAlertTitle>
            <AdminAlertDescription>
              Recipient email is used by the public contact mail API. Email or phone must remain enabled in CMS.
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
              <Button type="primary" htmlType="submit" loading={isSaving} disabled={!form.formState.isDirty}>
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
                    <FormLabel style={{ marginBottom: 0 }}>Enable Contact Form Section</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </AdminCard>

          <AdminCard>
            <Typography.Title level={4} style={{ marginTop: 0 }}>Form Copy</Typography.Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
              <FormField control={form.control} name="eyebrow" render={({ field }) => (
                <FormItem><FormLabel>Eyebrow</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="submit_label" render={({ field }) => (
                <FormItem><FormLabel>Submit Label</FormLabel><FormControl><Input {...field} maxLength={40} showCount /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} maxLength={140} showCount /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="success_message" render={({ field }) => (
              <FormItem><FormLabel>Success Message</FormLabel><FormControl><Textarea {...field} maxLength={200} showCount /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="error_message" render={({ field }) => (
              <FormItem><FormLabel>Error Message</FormLabel><FormControl><Textarea {...field} maxLength={200} showCount /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="rate_limit_message" render={({ field }) => (
              <FormItem><FormLabel>Rate Limit Message</FormLabel><FormControl><Textarea {...field} maxLength={200} showCount /></FormControl><FormMessage /></FormItem>
            )} />
          </AdminCard>

          <AdminCard>
            <Typography.Title level={4} style={{ marginTop: 0 }}>Mail Delivery</Typography.Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20 }}>
              <FormField control={form.control} name="recipient_email" render={({ field }) => (
                <FormItem><FormLabel>Recipient Email</FormLabel><FormControl><Input {...field} maxLength={200} showCount /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email_subject_prefix" render={({ field }) => (
                <FormItem><FormLabel>Email Subject Prefix</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </AdminCard>

          {renderFieldConfig('fullname', 'Full Name Field')}
          {renderFieldConfig('email', 'Email Field')}
          {renderFieldConfig('phone', 'Phone Field')}
          {renderFieldConfig('message', 'Message Field')}
        </form>
      </Form>
    </div>
  );
}

const SaveRow = (props: React.ComponentProps<'div'>) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }} {...props} />
);
