'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsSharedSection, sharedExclusiveTalentsSchema, SCHEMA_KEYS } from '@/lib/cms';
import { saveSharedSection, publishSharedSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

type FormValues = z.infer<typeof sharedExclusiveTalentsSchema> & { enabled: boolean };

interface SharedExclusiveTalentsManagerProps {
  section: CmsSharedSection;
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
    resolver: zodResolver(sharedExclusiveTalentsSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content?.section_title || '',
      featured_name: section.content?.featured_name || '',
      featured_handle: section.content?.featured_handle || '',
      featured_photo: section.content?.featured_photo || '',
      featured_photo_alt: section.content?.featured_photo_alt || '',
      featured_description: section.content?.featured_description || '',
      featured_stats: section.content?.featured_stats?.length
        ? section.content.featured_stats
        : [
            { label: '', value: '' },
            { label: '', value: '' },
          ],
      talent_count_label: section.content?.talent_count_label || '',
      talents: section.content?.talents?.length ? section.content.talents : [{ name: '', photo: '', photo_alt: '' }],
    },
  });

  const { fields: statFields } = useFieldArray({
    control: form.control,
    name: 'featured_stats',
  });

  const { fields: talentFields, append: appendTalent, remove: removeTalent } = useFieldArray({
    control: form.control,
    name: 'talents',
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
      <form onSubmit={form.handleSubmit(onSaveDraft)} className="space-y-6">
        <Alert>
          <AlertTitle>Cross-Page Impact Warning</AlertTitle>
          <AlertDescription>
            This shared section is used by multiple routes. Publish will update all routes listed below.
          </AlertDescription>
          <div className="mt-3 flex flex-wrap gap-2">
            {usageRoutes.map((route) => (
              <Badge key={`exclusive-${route}`} variant="outline">
                {route}
              </Badge>
            ))}
          </div>
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
                <Badge variant="outline">{section.schema_key}</Badge>
                <Badge variant={section.published_enabled ? 'default' : 'outline'}>
                  {section.published_enabled ? 'Published: Enabled' : 'Published: Disabled'}
                </Badge>
                <Badge variant={section.has_unpublished_changes ? 'secondary' : 'outline'}>
                  {section.has_unpublished_changes ? 'Has Unpublished Changes' : 'No Unpublished Changes'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Your role: {role}</p>
              <p className="text-xs text-muted-foreground">
                Last edited: {section.last_edited_by_identifier ?? 'N/A'} at {formatAuditDate(section.last_edited_at)}
              </p>
              <p className="text-xs text-muted-foreground">
                Last published: {section.last_published_by_identifier ?? 'N/A'} at {formatAuditDate(section.last_published_at)}
              </p>
            </div>

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

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <FormLabel>Enable Shared Section</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="section_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 rounded-md border p-4">
          <h3 className="text-base font-semibold">Featured Talent</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="featured_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured_handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="featured_photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Photo URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured_photo_alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Photo Alt</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="featured_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={6} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Featured Stats (exactly 2)</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {statFields.map((stat, index) => (
                <div key={stat.id} className="rounded-md border p-3">
                  <FormField
                    control={form.control}
                    name={`featured_stats.${index}.label`}
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
                    name={`featured_stats.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Talent Grid Items</h3>
            <Button type="button" variant="outline" onClick={() => appendTalent({ name: '', photo: '', photo_alt: '' })}>
              Add Talent
            </Button>
          </div>

          <FormField
            control={form.control}
            name="talent_count_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Talent Count Label</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="50+ TALENTS" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {talentFields.map((talent, index) => (
            <div key={talent.id} className="grid gap-3 rounded-md border p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
              <FormField
                control={form.control}
                name={`talents.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`talents.${index}.photo`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`talents.${index}.photo_alt`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo Alt</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeTalent(index)}
                  disabled={talentFields.length <= 1}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </form>
    </Form>
  );
}
