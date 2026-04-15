'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsSharedSection, sharedContactCtaSchema } from '@/lib/cms';
import { saveSharedSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription, AdminAlertTitle as AlertTitle } from '@/components/admin/layout/AdminPrimitives';
import { FormStack, HeaderRow, TwoColumnGrid } from './EditorLayout';
import { z } from 'zod';



export function SharedContactCtaEditor({ section }: { section: CmsSharedSection }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  type FormValues = z.infer<typeof sharedContactCtaSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(sharedContactCtaSchema),
    defaultValues: {
      title: section.content.title || '',
      subtitle: section.content.subtitle || '',
      cta_label: section.content.cta_label || '',
      cta_url: section.content.cta_url || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(false);
    setErrorMsg(null);
    try {
      await saveSharedSection(section.schema_key, data);
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
        <Alert variant="default" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
          <AlertTitle>Shared Content Warning</AlertTitle>
          <AlertDescription>
            This Contact CTA section is shared across multiple pages (Home, For Creators, Blogs, etc.). 
            Modifying its content here will affect all pages displaying this section.
          </AlertDescription>
        </Alert>

        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Shared section saved successfully.</AlertDescription></Alert>}

        <HeaderRow>
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Shared Section'}
          </Button>
        </HeaderRow>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TwoColumnGrid>
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
        </TwoColumnGrid>
      </FormStack>
    </Form>
  );
}
