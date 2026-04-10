'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsSharedSection, sharedContactCtaSchema } from '@/lib/cms';
import { saveSharedSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/Form';
import { Input, Textarea } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Alert, AlertDescription, AlertTitle } from '../../ui/Alert';
import { z } from 'zod';

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

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
      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

        <FormGrid>
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
        </FormGrid>
      </form>
    </Form>
  );
}
