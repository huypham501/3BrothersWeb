'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Typography } from 'antd';
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
import { CmsActionFeedback, useCmsActionFeedback } from '@/components/admin/cms/CmsActionFeedback';

const editorSchema = z.intersection(globalContactPageSchema, z.object({ enabled: z.boolean() }));

type FormValues = z.infer<typeof globalContactPageSchema> & { enabled: boolean };
type FieldKey = keyof FormValues['fields'];

const FIELD_ROWS: Array<{ key: FieldKey; label: string }> = [
  { key: 'fullname', label: 'Full name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'message', label: 'Message' },
];

interface GlobalContactPageEditorProps {
  setting: CmsGlobalSetting<z.infer<typeof globalContactPageSchema>>;
  role: string;
  canPublish: boolean;
}

export function GlobalContactPageEditor({ setting, role, canPublish }: GlobalContactPageEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const { feedback, showSuccess, showError, clearFeedback } = useCmsActionFeedback();

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

  const fields = form.watch('fields');
  const contactChannelMissing = !fields.email.enabled && !fields.phone.enabled;

  const saveValues = async (values: FormValues) => {
    const { enabled, ...payload } = values;
    await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_CONTACT_PAGE, payload, enabled);
  };

  const onSaveDraft = async (values: FormValues) => {
    setIsSaving(true);
    clearFeedback();

    try {
      await saveValues(values);
      showSuccess('Contact page draft saved. Changes are not live until publish.');
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
        await saveValues(values);
      }

      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_CONTACT_PAGE);
      showSuccess('Contact page settings published.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      showError(error, 'Failed to publish. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFieldEnabledChange = (fieldKey: FieldKey, checked: boolean, onChange: (value: boolean) => void) => {
    onChange(checked);
    if (!checked) {
      form.setValue(`fields.${fieldKey}.required`, false, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  };

  const renderFieldRow = ({ key, label }: { key: FieldKey; label: string }) => {
    const isEnabled = fields[key].enabled;
    const toggleCellStyle: React.CSSProperties = {
      alignItems: 'flex-start',
      marginBottom: 0,
      paddingTop: 3,
    };

    return (
      <div
        key={key}
        style={{
          display: 'grid',
          gridTemplateColumns: '150px 88px 96px minmax(180px, 1fr) minmax(220px, 1.2fr)',
          gap: 16,
          alignItems: 'start',
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <Typography.Text strong style={{ paddingTop: 7 }}>{label}</Typography.Text>

        <FormField
          control={form.control}
          name={`fields.${key}.enabled`}
          render={({ field }) => (
            <FormItem style={toggleCellStyle}>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => handleFieldEnabledChange(key, checked, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`fields.${key}.required`}
          render={({ field }) => (
            <FormItem style={toggleCellStyle}>
              <FormControl>
                <Switch
                  checked={isEnabled && field.value}
                  disabled={!isEnabled}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`fields.${key}.label`}
          render={({ field }) => (
            <FormItem style={{ marginBottom: 0 }}>
              <FormControl>
                <Input {...field} disabled={!isEnabled} maxLength={60} showCount />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`fields.${key}.placeholder`}
          render={({ field }) => (
            <FormItem style={{ marginBottom: 0 }}>
              <FormControl>
                <Input {...field} disabled={!isEnabled} maxLength={80} showCount />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 20,
  };

  const cardTitleStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 16,
  };

  const sectionDescriptionStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 16,
  };

  const fieldHeaderStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '150px 88px 96px minmax(180px, 1fr) minmax(220px, 1.2fr)',
    gap: 16,
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0,
    paddingBottom: 8,
  };

  const renderFormFieldsEditor = () => (
    <AdminCard>
      <Typography.Title level={4} style={cardTitleStyle}>Form Fields</Typography.Title>
      <Typography.Text type="secondary" style={sectionDescriptionStyle}>
        Configure which fields render on the public contact form and whether each field is required.
      </Typography.Text>

      {contactChannelMissing ? (
        <AdminAlert tone="destructive">
          <AdminAlertDescription>
            Enable at least Email or Phone so users have an actionable contact channel.
          </AdminAlertDescription>
        </AdminAlert>
      ) : null}

      <div style={{ overflowX: 'auto', marginTop: contactChannelMissing ? 16 : 0 }}>
        <div style={{ minWidth: 880 }}>
          <div style={fieldHeaderStyle}>
            <span>Field</span>
            <span>Visible</span>
            <span>Required</span>
            <span>Label</span>
            <span>Placeholder</span>
          </div>
          {FIELD_ROWS.map(renderFieldRow)}
        </div>
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

          <CmsActionFeedback feedback={feedback} />

          <AdminCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem style={{ marginBottom: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <FormLabel style={{ marginBottom: 4 }}>Enable Contact Form Section</FormLabel>
                        <Typography.Text type="secondary">
                          Hide or show the editable form section on the public Contact page.
                        </Typography.Text>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="primary" htmlType="submit" loading={isSaving} disabled={!form.formState.isDirty}>
                Save Draft
              </Button>
            </div>
          </AdminCard>

          <AdminCard>
            <Typography.Title level={4} style={cardTitleStyle}>Content Copy</Typography.Title>
            <div style={gridStyle}>
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
          </AdminCard>

          {renderFormFieldsEditor()}

          <AdminCard>
            <Typography.Title level={4} style={cardTitleStyle}>Feedback Messages</Typography.Title>
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
            <Typography.Title level={4} style={cardTitleStyle}>Mail Delivery</Typography.Title>
            <div style={gridStyle}>
              <FormField control={form.control} name="recipient_email" render={({ field }) => (
                <FormItem><FormLabel>Recipient Email</FormLabel><FormControl><Input {...field} maxLength={200} showCount /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email_subject_prefix" render={({ field }) => (
                <FormItem><FormLabel>Email Subject Prefix</FormLabel><FormControl><Input {...field} maxLength={80} showCount /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </AdminCard>
        </form>
      </Form>
    </div>
  );
}
