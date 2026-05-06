'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsGlobalSetting, globalHeaderSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminImageUpload } from '@/components/admin/controls/AdminImageUpload';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminButton,
} from '@/components/admin/layout/AdminPrimitives';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';

type FormValues = z.infer<typeof globalHeaderSchema> & { enabled: boolean };

interface GlobalHeaderEditorProps {
  setting: CmsGlobalSetting<z.infer<typeof globalHeaderSchema>>;
  role: string;
  canPublish: boolean;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CmsEditorStatusBar
        pageTitle="Global Header"
        hasUnpublished={setting.has_unpublished_changes ?? false}
        lastEditedBy={setting.last_edited_by_identifier}
        lastEditedAt={setting.last_edited_at}
        lastPublishedBy={setting.last_published_by_identifier}
        lastPublishedAt={setting.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        publishLabel="Publish Header"
      />

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
            <SaveRow>
              <AdminButton
                type="submit"
                variant="outline"
                disabled={isSaving || isPublishing || !form.formState.isDirty}
              >
                {isSaving ? 'Saving Draft...' : 'Save Draft'}
              </AdminButton>
            </SaveRow>

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
                  <Input {...field} maxLength={20} showCount />
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
                <FormLabel>Logo Image</FormLabel>
                <FormControl>
                  <AdminImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    label="Logo Image"
                  />
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
                      <Input {...field} maxLength={40} showCount />
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
                      <Input {...field} maxLength={500} showCount />
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
                  <Input {...field} maxLength={30} showCount />
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
                  <Input {...field} maxLength={500} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </TwoColumnGrid>
        </FormRoot>
      </Form>
    </div>
  );
}

const FormRoot = (props: React.ComponentProps<'form'>) => <form {...props} />;
const SectionCard = (props: React.ComponentProps<'div'>) => <div {...props} />;
const SaveRow = (props: React.ComponentProps<'div'>) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }} {...props} />
);
const Divider = (props: React.ComponentProps<'hr'>) => <hr {...props} />;
const ToggleFormItem = (props: React.ComponentProps<typeof FormItem>) => (
  <FormItem {...props} />
);
const TwoColumnGrid = (props: React.ComponentProps<'div'>) => <div {...props} />;
const Block = (props: React.ComponentProps<'div'>) => <div {...props} />;
const BlockHeader = (props: React.ComponentProps<'div'>) => <div {...props} />;
const BlockTitle = (props: React.ComponentProps<'h3'>) => <h3 {...props} />;
const EditableRow = (props: React.ComponentProps<'div'>) => <div {...props} />;
const RowActions = (props: React.ComponentProps<'div'>) => <div {...props} />;
