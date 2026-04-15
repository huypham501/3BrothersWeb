'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { CmsGlobalSetting, globalSiteMetadataSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminButton,
} from '@/components/admin/layout/AdminPrimitives';

type FormValues = z.infer<typeof globalSiteMetadataSchema>;

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export function GlobalSiteMetadataEditor({
  setting,
  role,
  canPublish,
}: {
  setting: CmsGlobalSetting;
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
      if (form.formState.isDirty) {
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

  return (
    <Form {...form}>
      <FormRoot onSubmit={form.handleSubmit(onSaveDraft)}>
        <AdminAlert>
          <AdminAlertTitle>Global Metadata Impact</AdminAlertTitle>
          <AdminAlertDescription>
            Site metadata controls metadata base URL, canonical base, and brand identity defaults used by CMS-driven pages.
          </AdminAlertDescription>
        </AdminAlert>

        {errorMsg && <AdminAlert tone="destructive"><AdminAlertDescription>{errorMsg}</AdminAlertDescription></AdminAlert>}
        {successMsg && <AdminAlert><AdminAlertDescription>{successMsg}</AdminAlertDescription></AdminAlert>}

        <SectionCard>
          <ActionHeader>
            <BadgeRow>
              <AdminBadge>{setting.schema_key}</AdminBadge>
              <AdminBadge tone={setting.published_enabled ? 'success' : 'neutral'}>
                {setting.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
              </AdminBadge>
              <AdminBadge tone={setting.has_unpublished_changes ? 'warning' : 'neutral'}>
                {setting.has_unpublished_changes ? 'Has Unpublished Changes' : 'No Unpublished Changes'}
              </AdminBadge>
            </BadgeRow>
            <MetaText>Your role: {role}</MetaText>
            <MetaText>
              Last edited: {setting.last_edited_by_identifier ?? 'N/A'} at {formatAuditDate(setting.last_edited_at)}
            </MetaText>
            <MetaText>
              Last published: {setting.last_published_by_identifier ?? 'N/A'} at {formatAuditDate(setting.last_published_at)}
            </MetaText>
            <ButtonGroup>
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
            </ButtonGroup>
          </ActionHeader>
          <Divider />
          <ScopeText>Revalidation scope: `/`, `/for-creators`</ScopeText>
        </SectionCard>

        <FormField control={form.control} name="site_name" render={({ field }) => (
          <FormItem><FormLabel>Site Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <TwoColumnGrid>
          <FormField control={form.control} name="site_url" render={({ field }) => (
            <FormItem><FormLabel>Site URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="default_canonical_base" render={({ field }) => (
            <FormItem><FormLabel>Default Canonical Base</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>

        <TwoColumnGrid>
          <FormField control={form.control} name="brand_name" render={({ field }) => (
            <FormItem><FormLabel>Brand Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="publisher_name" render={({ field }) => (
            <FormItem><FormLabel>Publisher Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </TwoColumnGrid>
      </FormRoot>
    </Form>
  );
}

const FormRoot = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionCard = styled.div`
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  padding: 16px;
`;

const ActionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MetaText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: 0;
  border-top: 1px solid #e2e8f0;
`;

const ScopeText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
