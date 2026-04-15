'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { CmsGlobalSetting, globalHeaderSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminButton,
} from '@/components/admin/layout/AdminPrimitives';

type FormValues = z.infer<typeof globalHeaderSchema> & { enabled: boolean };

interface GlobalHeaderEditorProps {
  setting: CmsGlobalSetting;
  role: string;
  canPublish: boolean;
}

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
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
    <Form {...form}>
      <FormRoot onSubmit={form.handleSubmit(onSaveDraft)}>
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

        <SectionCard>
          <ActionHeader>
            <MetaGroup>
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
            </MetaGroup>

            <ButtonGroup>
              <AdminButton type="submit" disabled={isSaving || isPublishing || !form.formState.isDirty} variant="outline">
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
                  <FormLabel>Enable Header</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </ToggleFormItem>
            )}
          />
        </SectionCard>

        <TwoColumnGrid>
          <FormField
            control={form.control}
            name="logo_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo Text</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Logo Image URL</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TwoColumnGrid>

        <Block>
          <BlockHeader>
            <BlockTitle>Navigation Links</BlockTitle>
            <AdminButton
              type="button"
              variant="outline"
              onClick={() => navLinksArray.append({ label: '', url: '/' })}
              disabled={navLinksArray.fields.length >= 8}
            >
              Add Link
            </AdminButton>
          </BlockHeader>

          {navLinksArray.fields.map((field, index) => (
            <EditableRow key={field.id}>
              <FormField
                control={form.control}
                name={`nav_links.${index}.label`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <RowActions>
                <AdminButton
                  type="button"
                  variant="outline"
                  onClick={() => navLinksArray.remove(index)}
                  disabled={navLinksArray.fields.length <= 1}
                >
                  Remove
                </AdminButton>
              </RowActions>
            </EditableRow>
          ))}
        </Block>

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

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const BlockTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
`;

const EditableRow = styled.div`
  display: grid;
  gap: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr auto;
  }
`;

const RowActions = styled.div`
  display: flex;
  align-items: flex-end;
`;
