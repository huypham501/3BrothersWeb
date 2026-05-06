'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Descriptions, Divider, Typography } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { CmsSharedSection, sharedContactCtaSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveSharedSection, publishSharedSection } from '@/lib/cms/actions';
import { fmtAuditDate } from '@/lib/cms/utils';
import { Form, FormControl, FormField, FormLabel } from '@/components/admin/controls/AdminForm';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminCard,
} from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ToggleFormItem } from '@/components/admin/cms/editors/EditorLayout';
import {
  SharedContactCtaFields,
  SharedContactCtaFormValues,
  getSharedContactCtaDefaultValues,
} from '@/components/admin/cms/editors/SharedContactCtaEditor';

type FormValues = SharedContactCtaFormValues & { enabled: boolean };

interface SharedContactCtaManagerProps {
  section: CmsSharedSection<z.infer<typeof sharedContactCtaSchema>>;
  usageRoutes: string[];
  role: string;
  canPublish: boolean;
}

export function SharedContactCtaManager({
  section,
  usageRoutes,
  role,
  canPublish,
}: SharedContactCtaManagerProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(sharedContactCtaSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      ...getSharedContactCtaDefaultValues(section.content),
      enabled: section.enabled,
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
      const { enabled, ...payload } = values;
      await saveSharedSection(SCHEMA_KEYS.SHARED_CONTACT_CTA, payload, enabled);
      setSuccessMsg('Contact CTA draft saved. Changes are not live until publish.');
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
        await saveSharedSection(SCHEMA_KEYS.SHARED_CONTACT_CTA, payload, enabled);
      }

      await publishSharedSection(SCHEMA_KEYS.SHARED_CONTACT_CTA);
      setSuccessMsg('Contact CTA published and affected routes revalidated.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Form {...form}>
      <FormStack onSubmit={form.handleSubmit(onSaveDraft)}>
        <AdminAlert tone="warning">
          <AdminAlertTitle>Cross-Page Impact Warning</AdminAlertTitle>
          <AdminAlertDescription>
            This shared section is used by multiple routes. Publish will update all routes listed below.
          </AdminAlertDescription>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {usageRoutes.map((route) => (
              <AdminBadge key={`contact-cta-${route}`}>{route}</AdminBadge>
            ))}
          </div>
        </AdminAlert>

        {errorMsg && (
          <AdminAlert tone="destructive">
            <AdminAlertDescription>{errorMsg}</AdminAlertDescription>
          </AdminAlert>
        )}

        {successMsg && (
          <AdminAlert tone="success">
            <AdminAlertDescription>{successMsg}</AdminAlertDescription>
          </AdminAlert>
        )}

        <AdminCard bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <HeaderRow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <AdminBadge>{section.schema_key}</AdminBadge>
                <AdminBadge tone={section.published_enabled ? 'success' : 'neutral'}>
                  {section.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                </AdminBadge>
                <AdminBadge tone={section.has_unpublished_changes ? 'warning' : 'neutral'}>
                  {section.has_unpublished_changes ? 'Has Unpublished Changes' : 'No Unpublished Changes'}
                </AdminBadge>
              </div>
              <Descriptions size="small" column={{ xs: 1, sm: 2, md: 3 }}>
                <Descriptions.Item label="Role">
                  <Typography.Text type="secondary">{role}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Người sửa cuối">
                  <Typography.Text type="secondary">
                    {section.last_edited_by_identifier ?? '—'} · {fmtAuditDate(section.last_edited_at)}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Người publish cuối">
                  <Typography.Text type="secondary">
                    {section.last_published_by_identifier ?? '—'} · {fmtAuditDate(section.last_published_at)}
                  </Typography.Text>
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSaving}
                disabled={isPublishing || !form.formState.isDirty}
              >
                Save Draft
              </Button>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                loading={isPublishing}
                disabled={isSaving || isPublishing || !canPublish}
                onClick={handlePublish}
                title={canPublish ? undefined : 'Your role cannot publish.'}
              >
                Publish Contact CTA
              </Button>
            </div>
          </HeaderRow>

          <Divider style={{ margin: 0 }} />

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <ToggleFormItem>
                <div>
                  <FormLabel>Enable Shared Section</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </ToggleFormItem>
            )}
          />
        </AdminCard>

        <SharedContactCtaFields form={form} />
      </FormStack>
    </Form>
  );
}
