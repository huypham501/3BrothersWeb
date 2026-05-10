'use client';

import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { sharedCtaSchema } from '@/lib/cms';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { TwoColumnGrid } from './EditorLayout';

export type SharedCtaFormValues = z.infer<typeof sharedCtaSchema>;

export function getSharedCtaDefaultValues(
  content?: Partial<SharedCtaFormValues> | null
): SharedCtaFormValues {
  return {
    heading: content?.heading || '',
    subtitle: content?.subtitle || '',
    cta_label: content?.cta_label || '',
    cta_url: content?.cta_url || '/contact',
  };
}

export function SharedCtaFields({ form }: { form: UseFormReturn<any> }) {
  return (
    <>
      <FormField
        control={form.control}
        name="heading"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heading</FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} maxLength={180} showCount />
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
              <Textarea {...field} rows={3} maxLength={300} showCount />
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
                <Input {...field} maxLength={40} showCount />
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
                <Input {...field} maxLength={500} showCount />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TwoColumnGrid>
    </>
  );
}
