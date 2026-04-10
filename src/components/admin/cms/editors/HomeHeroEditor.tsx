'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, homeHeroSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/Form';
import { Input, Textarea } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Switch } from '../../ui/Switch';
import { Alert, AlertDescription } from '../../ui/Alert';
import { z } from 'zod';

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export function HomeHeroEditor({ pageId, section }: { pageId: string, section: CmsPageSection }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  type FormValues = z.infer<typeof homeHeroSchema> & { enabled: boolean };

  const form = useForm<FormValues>({
    resolver: zodResolver(homeHeroSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      title: section.content.title,
      subtext: section.content.subtext,
      primary_cta_label: section.content.primary_cta_label,
      primary_cta_url: section.content.primary_cta_url,
      secondary_cta_label: section.content.secondary_cta_label || '',
      secondary_cta_url: section.content.secondary_cta_url || '',
      media_image: section.content.media_image || '',
      media_image_alt: section.content.media_image_alt || '',
    },
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
      form.reset(data); // reset dirty state
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Hero section saved successfully.</AlertDescription></Alert>}

        <HeaderRow>
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FormLabel style={{ marginBottom: 0 }}>Enable Section</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Section'}
          </Button>
        </HeaderRow>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subtext"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtext</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormGrid>
          <FormField
            control={form.control}
            name="primary_cta_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary CTA Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primary_cta_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary CTA URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormGrid>

        <FormGrid>
          <FormField
            control={form.control}
            name="secondary_cta_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary CTA Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondary_cta_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary CTA URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormGrid>

        <FormGrid>
          <FormField
            control={form.control}
            name="media_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media Image URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="media_image_alt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media Image Alt</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormGrid>
      </form>
    </Form>
  );
}
