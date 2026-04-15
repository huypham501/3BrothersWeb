'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsGlobalSetting, globalHeaderSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

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
      <form onSubmit={form.handleSubmit(onSaveDraft)} className="space-y-6">
        <Alert>
          <AlertTitle>Global Impact Warning</AlertTitle>
          <AlertDescription>
            This Header configuration is shared across multiple pages. Draft first, then publish when you are ready to update site-wide chrome.
          </AlertDescription>
        </Alert>

        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {successMsg && (
          <Alert variant="success">
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-md border bg-card p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{setting.schema_key}</Badge>
                <Badge variant={setting.published_enabled ? 'default' : 'outline'}>
                  {setting.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                </Badge>
                <Badge variant={setting.has_unpublished_changes ? 'secondary' : 'outline'}>
                  {setting.has_unpublished_changes ? 'Has Unpublished Changes' : 'No Unpublished Changes'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Your role: {role}</p>
              <p className="text-xs text-muted-foreground">
                Last edited: {setting.last_edited_by_identifier ?? 'N/A'} at {formatAuditDate(setting.last_edited_at)}
              </p>
              <p className="text-xs text-muted-foreground">
                Last published: {setting.last_published_by_identifier ?? 'N/A'} at {formatAuditDate(setting.last_published_at)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isSaving || isPublishing || !form.formState.isDirty} variant="outline">
                {isSaving ? 'Saving Draft...' : 'Save Draft'}
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={isSaving || isPublishing || !canPublish}
                title={canPublish ? undefined : 'Your role cannot publish.'}
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <FormLabel>Enable Header</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Navigation Links</h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => navLinksArray.append({ label: '', url: '/' })}
              disabled={navLinksArray.fields.length >= 8}
            >
              Add Link
            </Button>
          </div>

          {navLinksArray.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 rounded-md border p-3 md:grid-cols-[1fr_1fr_auto]">
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

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => navLinksArray.remove(index)}
                  disabled={navLinksArray.fields.length <= 1}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
        </div>
      </form>
    </Form>
  );
}
