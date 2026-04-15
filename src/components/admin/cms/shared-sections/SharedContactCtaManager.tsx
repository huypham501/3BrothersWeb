'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { CmsSharedSection, sharedContactCtaSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveSharedSection, publishSharedSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminButton,
} from '@/components/admin/layout/AdminPrimitives';

type FormValues = z.infer<typeof sharedContactCtaSchema> & { enabled: boolean };

interface SharedContactCtaManagerProps {
  section: CmsSharedSection;
  usageRoutes: string[];
  role: string;
  canPublish: boolean;
}

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
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
      enabled: section.enabled,
      title: section.content?.title || '',
      subtitle: section.content?.subtitle || '',
      cta_label: section.content?.cta_label || '',
      cta_url: section.content?.cta_url || '/',
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
      <FormRoot onSubmit={form.handleSubmit(onSaveDraft)}>
        <AdminAlert>
          <AdminAlertTitle>Cross-Page Impact Warning</AdminAlertTitle>
          <AdminAlertDescription>
            This shared section is used by multiple routes. Publish will update all routes listed below.
          </AdminAlertDescription>
          <BadgeRow>
            {usageRoutes.map((route) => (
              <AdminBadge key={`contact-cta-${route}`}>
                {route}
              </AdminBadge>
            ))}
          </BadgeRow>
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

        <SectionCard>
          <ActionHeader>
            <MetaGroup>
              <BadgeRow>
                <AdminBadge>{section.schema_key}</AdminBadge>
                <AdminBadge tone={section.published_enabled ? 'success' : 'neutral'}>
                  {section.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                </AdminBadge>
                <AdminBadge tone={section.has_unpublished_changes ? 'warning' : 'neutral'}>
                  {section.has_unpublished_changes ? 'Has Unpublished Changes' : 'No Unpublished Changes'}
                </AdminBadge>
              </BadgeRow>
              <MetaText>Your role: {role}</MetaText>
              <MetaText>
                Last edited: {section.last_edited_by_identifier ?? 'N/A'} at {formatAuditDate(section.last_edited_at)}
              </MetaText>
              <MetaText>
                Last published: {section.last_published_by_identifier ?? 'N/A'} at {formatAuditDate(section.last_published_at)}
              </MetaText>
            </MetaGroup>

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
        </SectionCard>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TwoColumnGrid>
          <FormField
            control={form.control}
            name="cta_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA Label</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const MetaGroup = styled.div`
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
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: 0;
  border-top: 1px solid #e2e8f0;
`;

const ToggleFormItem = styled(FormItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
