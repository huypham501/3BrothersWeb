'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Descriptions, Divider, Typography } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { CmsSharedSection, sharedExclusiveTalentsSchema, SCHEMA_KEYS } from '@/lib/cms';
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
import { CmsActionFeedback, useCmsActionFeedback } from '@/components/admin/cms/CmsActionFeedback';
import {
  SharedExclusiveTalentsFields,
  getSharedExclusiveTalentsDefaultValues,
  SharedExclusiveTalentsFormValues,
} from '@/components/admin/cms/editors/SharedExclusiveTalentsEditor';

type FormValues = SharedExclusiveTalentsFormValues & { enabled: boolean };
const sharedExclusiveTalentsManagerSchema = z.object({ enabled: z.boolean() }).and(sharedExclusiveTalentsSchema);

interface SharedExclusiveTalentsManagerProps {
  section: CmsSharedSection<z.infer<typeof sharedExclusiveTalentsSchema>>;
  usageRoutes: string[];
  role: string;
  canPublish: boolean;
}

export function SharedExclusiveTalentsManager({
  section,
  usageRoutes,
  role,
  canPublish,
}: SharedExclusiveTalentsManagerProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const { feedback, showSuccess, showError, clearFeedback } = useCmsActionFeedback();

  const form = useForm<FormValues>({
    resolver: zodResolver(sharedExclusiveTalentsManagerSchema),
    defaultValues: {
      ...getSharedExclusiveTalentsDefaultValues(section.content),
      enabled: section.enabled,
    },
  });

  const onSaveDraft = async (values: FormValues) => {
    setIsSaving(true);
    clearFeedback();

    try {
      const { enabled, ...payload } = values;
      await saveSharedSection(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS, payload, enabled);
      showSuccess('Exclusive Talents draft saved. Changes are not live until publish.');
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
        await saveSharedSection(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS, payload, enabled);
      }

      await publishSharedSection(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS);
      showSuccess('Exclusive Talents published and affected routes revalidated.');
      form.reset(values);
      router.refresh();
    } catch (error) {
      showError(error, 'Failed to publish. Please try again.');
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
              <AdminBadge key={`exclusive-${route}`}>{route}</AdminBadge>
            ))}
          </div>
        </AdminAlert>

        <CmsActionFeedback feedback={feedback} />

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
                Publish Exclusive Talents
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

        <SharedExclusiveTalentsFields form={form} />
      </FormStack>
    </Form>
  );
}
