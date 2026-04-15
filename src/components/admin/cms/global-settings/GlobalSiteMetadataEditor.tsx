'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsGlobalSetting, globalSiteMetadataSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
      <form onSubmit={form.handleSubmit(onSaveDraft)} className="space-y-6">
        <Alert>
          <AlertTitle>Global Metadata Impact</AlertTitle>
          <AlertDescription>
            Site metadata controls metadata base URL, canonical base, and brand identity defaults used by CMS-driven pages.
          </AlertDescription>
        </Alert>

        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {successMsg && <Alert variant="success"><AlertDescription>{successMsg}</AlertDescription></Alert>}

        <div className="rounded-md border bg-card p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
            <div className="flex items-center gap-2">
              <Button type="submit" variant="outline" disabled={isSaving || isPublishing || !form.formState.isDirty}>
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
          <p className="text-sm text-muted-foreground">Revalidation scope: `/`, `/for-creators`</p>
        </div>

        <FormField control={form.control} name="site_name" render={({ field }) => (
          <FormItem><FormLabel>Site Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="site_url" render={({ field }) => (
            <FormItem><FormLabel>Site URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="default_canonical_base" render={({ field }) => (
            <FormItem><FormLabel>Default Canonical Base</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="brand_name" render={({ field }) => (
            <FormItem><FormLabel>Brand Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="publisher_name" render={({ field }) => (
            <FormItem><FormLabel>Publisher Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
      </form>
    </Form>
  );
}
