'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPage, homePageSchema } from '@/lib/cms';
import { saveHomePageSettings } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { FooterRow, FormStack, SelectInput } from './EditorLayout';
import { CmsFieldHint } from '@/components/admin/cms/ux/CmsFieldHint';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';
import { z } from 'zod';

export function HomePageSettingsEditor({ page }: { page: CmsPage }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  type FormValues = z.infer<typeof homePageSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(homePageSchema),
    defaultValues: {
      slug: page.slug,
      internal_name: page.internal_name,
      status: page.status,
      seo_title: page.seo_title,
      seo_description: page.seo_description,
      og_image: page.og_image || '',
      og_image_alt: page.og_image_alt || '',
      canonical_url: page.canonical_url || '',
      keywords: page.keywords || [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(false);
    setErrorMsg(null);
    try {
      await saveHomePageSettings(page.id, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const ux = (fieldPath: string) => getCmsFieldUxSpec('home_page_settings', fieldPath);

  return (
    <Form {...form}>
      <FormStack onSubmit={form.handleSubmit(onSubmit)}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Settings saved successfully.</AlertDescription></Alert>}

        <div>
          <h4>General Information</h4>
          <div>
            <FormField
              control={form.control}
              name="internal_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ux('internal_name').label ?? 'Internal Name'}</FormLabel>
                  <FormControl>
                    <Input placeholder="Home - Main" {...field} />
                  </FormControl>
                  <CmsFieldHint formId="home_page_settings" fieldPath="internal_name" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ux('status').label ?? 'Status'}</FormLabel>
                  <FormControl>
                      <SelectInput {...field}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      </SelectInput>
                  </FormControl>
                  <CmsFieldHint formId="home_page_settings" fieldPath="status" />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h4>SEO Metadata</h4>
          <div>
            <FormField
              control={form.control}
              name="seo_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canonical_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ux('canonical_url').label ?? 'Canonical URL'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <CmsFieldHint formId="home_page_settings" fieldPath="canonical_url" />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="seo_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name="og_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="og_image_alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Image Alt</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords (comma separated)</FormLabel>
                <FormControl>
                  <Input 
                    value={field.value?.join(', ') || ''} 
                    onChange={(e) => {
                      const vals = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      field.onChange(vals);
                    }} 
                    placeholder="keyword1, keyword2" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FooterRow>
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Page Settings'}
          </Button>
        </FooterRow>
      </FormStack>
    </Form>
  );
}
