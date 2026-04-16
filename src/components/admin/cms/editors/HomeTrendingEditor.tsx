'use client';

import * as React from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, homeTrendingSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription, AdminAlertTitle as AlertTitle } from '@/components/admin/layout/AdminPrimitives';
import {
  ErrorText,
  FooterRow,
  FormStack,
  HeaderRow,
  ItemCard,
  SectionHeaderRow,
  SectionStack,
  SectionTitle,
  SelectInput,
  ToggleFormItem,
  TwoColumnGrid,
} from './EditorLayout';
import { z } from 'zod';




export function HomeTrendingEditor({ pageId, section }: { pageId: string, section: CmsPageSection<z.infer<typeof homeTrendingSchema>> }) {
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
      <FormStack onSubmit={form.handleSubmit(onSubmit)}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Trending section saved successfully.</AlertDescription></Alert>}

        <HeaderRow>
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <ToggleFormItem>
                <FormLabel>Enable Section</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </ToggleFormItem>
            )}
          />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Section'}
          </Button>
        </HeaderRow>

        <TwoColumnGrid>
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
                  <SelectInput {...field}>
                    <option value="manual">Manual Items</option>
                    <option value="auto_latest">Auto Latest Blog Posts</option>
                  </SelectInput>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TwoColumnGrid>

        <TwoColumnGrid>
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
        </TwoColumnGrid>

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
          <SectionStack>
            <SectionHeaderRow>
              <SectionTitle>Manual News Items ({fields.length})</SectionTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '', date: '', image: '', image_alt: '', url: '#' })}>
                + Add News Item
              </Button>
            </SectionHeaderRow>
            
            {fields.map((item, index) => (
              <ItemCard key={item.id}>
                <FormField
                  control={form.control}
                  name={`news_items.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>News Title</FormLabel>
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
                    name={`news_items.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem>
                        <FormLabel>Link URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TwoColumnGrid>
                <TwoColumnGrid>
                  <FormField
                    control={form.control}
                    name={`news_items.${index}.image`}
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem>
                        <FormLabel>Image Alt</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TwoColumnGrid>
                <FooterRow>
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                    Remove News Item
                  </Button>
                </FooterRow>
              </ItemCard>
            ))}
            {form.formState.errors.news_items && <ErrorText>{form.formState.errors.news_items.message}</ErrorText>}
          </SectionStack>
        )}

      </FormStack>
    </Form>
  );
}
