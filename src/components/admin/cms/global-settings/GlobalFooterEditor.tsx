'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';
import { CmsGlobalSetting, globalFooterSchema, SCHEMA_KEYS } from '@/lib/cms';
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

type FormValues = z.infer<typeof globalFooterSchema> & { enabled: boolean };

interface GlobalFooterEditorProps {
  setting: CmsGlobalSetting;
  role: string;
  canPublish: boolean;
}

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
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
    <Form {...form}>
      <FormRoot onSubmit={form.handleSubmit(onSaveDraft)}>
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
                  <FormLabel>Enable Footer</FormLabel>
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
          name="thank_you_heading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thank You Heading</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TwoColumnGrid>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
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
        </TwoColumnGrid>

        <Block>
          <BlockHeader>
            <BlockTitle>Menu Links</BlockTitle>
            <AdminButton
              type="button"
              variant="outline"
              onClick={() => menuLinksArray.append({ label: '', url: '/' })}
              disabled={menuLinksArray.fields.length >= 10}
            >
              Add Menu Link
            </AdminButton>
          </BlockHeader>

          {menuLinksArray.fields.map((field, index) => (
            <EditableRow key={field.id}>
              <FormField
                control={form.control}
                name={`menu_links.${index}.label`}
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
                name={`menu_links.${index}.url`}
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
                  onClick={() => menuLinksArray.remove(index)}
                  disabled={menuLinksArray.fields.length <= 1}
                >
                  Remove
                </AdminButton>
              </RowActions>
            </EditableRow>
          ))}
        </Block>

        <Block>
          <BlockHeader>
            <BlockTitle>Social Links</BlockTitle>
            <AdminButton
              type="button"
              variant="outline"
              onClick={() => socialLinksArray.append({ label: '', url: '#' })}
              disabled={socialLinksArray.fields.length >= 8}
            >
              Add Social Link
            </AdminButton>
          </BlockHeader>

          {socialLinksArray.fields.map((field, index) => (
            <EditableRow key={field.id}>
              <FormField
                control={form.control}
                name={`social_links.${index}.label`}
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
                name={`social_links.${index}.url`}
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
                  onClick={() => socialLinksArray.remove(index)}
                  disabled={socialLinksArray.fields.length <= 1}
                >
                  Remove
                </AdminButton>
              </RowActions>
            </EditableRow>
          ))}
        </Block>

        <FormField
          control={form.control}
          name="brand_watermark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Watermark</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
