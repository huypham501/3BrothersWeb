'use client';

import * as React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, homeTrendingSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { z } from 'zod';




export function HomeTrendingEditor({ pageId, section }: { pageId: string, section: CmsPageSection }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  type FormValues = z.infer<typeof homeTrendingSchema> & { enabled: boolean };

  const form = useForm<FormValues>({
    resolver: zodResolver(homeTrendingSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content.section_title || '',
      view_all_label: section.content.view_all_label || '',
      view_all_url: section.content.view_all_url || '',
      news_source: section.content.news_source || 'manual',
      news_limit: section.content.news_limit || 3,
      news_items: section.content.news_items || [],
    },
  });

  const newsSource = useWatch({ control: form.control, name: 'news_source' });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "news_items",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(false);
    setErrorMsg(null);
    try {
      const { enabled, ...payload } = data;
      await savePageSection(pageId, section.schema_key, payload, enabled);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      form.reset(data);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Trending section saved successfully.</AlertDescription></Alert>}

        <div className="flex justify-between items-center mb-6">
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormLabel className="col-span-full md:col-span-6">Enable Section</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Section'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <FormField
            control={form.control}
            name="news_source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>News Source</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-[#e2e8f0] bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-[#003CA6] focus:ring-2 focus:ring-[rgba(0,60,166,0.2)]"
                    style={{ height: '2.5rem', width: '100%', borderRadius: '0.375rem', border: '1px solid #e2e8f0', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                    {...field}
                  >
                    <option value="manual">Manual Items</option>
                    <option value="auto_latest">Auto Latest Blog Posts</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="view_all_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>View All Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="view_all_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>View All URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {newsSource === 'auto_latest' && (
          <FormField
            control={form.control}
            name="news_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Auto-fetched Items</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {newsSource === 'manual' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h5 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Manual News Items ({fields.length})</h5>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '', date: '', image: '', image_alt: '', url: '#' })}>
                + Add News Item
              </Button>
            </div>
            
            {fields.map((item, index) => (
              <div className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 border border-slate-200 rounded-lg mb-4 bg-slate-50 items-end" key={item.id}>
                <FormField
                  control={form.control}
                  name={`news_items.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="col-span-full md:col-span-6">
                      <FormLabel>News Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name={`news_items.${index}.date`}
                    render={({ field }) => (
                      <FormItem className="col-span-full md:col-span-6">
                        <FormLabel>Date string</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="12 JAN 2026" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`news_items.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="col-span-full md:col-span-6">
                        <FormLabel>Link URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name={`news_items.${index}.image`}
                    render={({ field }) => (
                      <FormItem className="col-span-full md:col-span-6">
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`news_items.${index}.image_alt`}
                    render={({ field }) => (
                      <FormItem className="col-span-full md:col-span-6">
                        <FormLabel>Image Alt</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                    Remove News Item
                  </Button>
                </div>
              </div>
            ))}
            {form.formState.errors.news_items && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{form.formState.errors.news_items.message}</p>}
          </div>
        )}

      </form>
    </Form>
  );
}
