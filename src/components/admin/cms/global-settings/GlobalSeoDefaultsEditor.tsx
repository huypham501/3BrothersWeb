'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsGlobalSetting, globalSeoDefaultsSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveGlobalSettingDraft, publishGlobalSetting } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type FormValues = z.infer<typeof globalSeoDefaultsSchema>;

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export function GlobalSeoDefaultsEditor({
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
    resolver: zodResolver(globalSeoDefaultsSchema),
    defaultValues: {
      default_title_template: setting.content?.default_title_template || '{{page_title}} | {{brand_name}}',
      default_meta_description: setting.content?.default_meta_description || '',
      default_keywords: setting.content?.default_keywords || [],
      default_og_image: setting.content?.default_og_image || '/3brothers.png',
      default_og_image_alt: setting.content?.default_og_image_alt || '3BROTHERS NETWORK',
      default_twitter_card_type: setting.content?.default_twitter_card_type || 'summary_large_image',
      default_robots: setting.content?.default_robots || 'index,follow',
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
      await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS, values, setting.enabled);
      setSuccessMsg('SEO defaults draft saved. Changes are not live until publish.');
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
        await saveGlobalSettingDraft(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS, values, setting.enabled);
      }
      await publishGlobalSetting(SCHEMA_KEYS.GLOBAL_SEO_DEFAULTS);
      setSuccessMsg('SEO defaults published and metadata routes revalidated.');
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
            SEO defaults affect metadata fallback across CMS-driven pages. Draft changes are safe until publish.
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

        <FormField control={form.control} name="default_title_template" render={({ field }) => (
          <FormItem>
            <FormLabel>Default Title Template</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <p className="text-xs text-muted-foreground">
              Supported placeholders: <code>{'{{page_title}}'}</code>, <code>{'{{site_name}}'}</code>, <code>{'{{brand_name}}'}</code>
            </p>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="default_meta_description" render={({ field }) => (
          <FormItem><FormLabel>Default Meta Description</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField
          control={form.control}
          name="default_keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Keywords (comma separated)</FormLabel>
              <FormControl>
                <Input
                  value={field.value?.join(', ') || ''}
                  onChange={(e) => {
                    const vals = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    field.onChange(vals);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="default_og_image" render={({ field }) => (
            <FormItem><FormLabel>Default OG Image</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="default_og_image_alt" render={({ field }) => (
            <FormItem><FormLabel>Default OG Image Alt</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="default_twitter_card_type" render={({ field }) => (
            <FormItem>
              <FormLabel>Default Twitter Card Type</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="default_robots" render={({ field }) => (
            <FormItem><FormLabel>Default Robots</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
      </form>
    </Form>
  );
}
