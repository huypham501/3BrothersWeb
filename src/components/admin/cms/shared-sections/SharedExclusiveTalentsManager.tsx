'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsSharedSection, sharedExclusiveTalentsSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveSharedSection, publishSharedSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormLabel } from '@/components/admin/controls/AdminForm';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminButton,
} from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, ToggleFormItem } from '@/components/admin/cms/editors/EditorLayout';
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

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
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
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(sharedExclusiveTalentsManagerSchema),
    defaultValues: {
      ...getSharedExclusiveTalentsDefaultValues(section.content),
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
      await saveSharedSection(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS, payload, enabled);
      setSuccessMsg('Exclusive Talents draft saved. Changes are not live until publish.');
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
        await saveSharedSection(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS, payload, enabled);
      }

      await publishSharedSection(SCHEMA_KEYS.SHARED_EXCLUSIVE_TALENTS);
      setSuccessMsg('Exclusive Talents published and affected routes revalidated.');
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
        <AdminAlert>
          <AdminAlertTitle>Cross-Page Impact Warning</AdminAlertTitle>
          <AdminAlertDescription>
            This shared section is used by multiple routes. Publish will update all routes listed below.
          </AdminAlertDescription>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {usageRoutes.map((route) => (
              <AdminBadge key={`exclusive-${route}`}>{route}</AdminBadge>
            ))}
          </div>
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

        <div style={{ border: '1px solid #d0d5dd', borderRadius: 10, background: '#ffffff', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              <p style={{ margin: 0 }}>Your role: {role}</p>
              <p style={{ margin: 0 }}>
                Last edited: {section.last_edited_by_identifier ?? 'N/A'} at {formatAuditDate(section.last_edited_at)}
              </p>
              <p style={{ margin: 0 }}>
                Last published: {section.last_published_by_identifier ?? 'N/A'} at {formatAuditDate(section.last_published_at)}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <AdminButton type="submit" variant="outline" disabled={isSaving || isPublishing || !form.formState.isDirty}>
                {isSaving ? 'Saving Draft...' : 'Save Draft'}
              </AdminButton>
              <AdminButton
                type="button"
                onClick={handlePublish}
                disabled={isSaving || isPublishing || !canPublish}
                title={canPublish ? undefined : 'Your role cannot publish.'}
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </AdminButton>
            </div>
          </HeaderRow>

          <hr style={{ width: '100%', borderColor: '#e4e7ec', margin: 0 }} />

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
        </div>

        <SharedExclusiveTalentsFields form={form} />
      </FormStack>
    </Form>
  );
}
