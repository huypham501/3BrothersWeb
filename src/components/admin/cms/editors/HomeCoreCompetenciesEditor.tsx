'use client';

import * as React from 'react';
import styled from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsPageSection, homeCoreCompetenciesSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/Form';
import { Input, Textarea } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Switch } from '../../ui/Switch';
import { Alert, AlertDescription } from '../../ui/Alert';
import { z } from 'zod';

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ArrayItemGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 16px;
  background: #f8fafc;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export function HomeCoreCompetenciesEditor({ pageId, section }: { pageId: string, section: CmsPageSection }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  type FormValues = z.infer<typeof homeCoreCompetenciesSchema> & { enabled: boolean };

  const form = useForm<FormValues>({
    resolver: zodResolver(homeCoreCompetenciesSchema.extend({ enabled: z.boolean() })),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content.section_title || '',
      services: section.content.services || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
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
      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Core Competencies saved successfully.</AlertDescription></Alert>}

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
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Services ({fields.length})</h5>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '', description: '', image: '', link_url: '#' })}>
              + Add Service
            </Button>
          </div>
          
          {fields.map((item, index) => (
            <ArrayItemGrid key={item.id}>
              <FormField
                control={form.control}
                name={`services.${index}.title`}
                render={({ field }) => (
                  <FormItem style={{ marginBottom: 0 }}>
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
                name={`services.${index}.description`}
                render={({ field }) => (
                  <FormItem style={{ marginBottom: 0 }}>
                    <FormLabel>Description</FormLabel>
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
                  name={`services.${index}.image`}
                  render={({ field }) => (
                    <FormItem style={{ marginBottom: 0 }}>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`services.${index}.link_url`}
                  render={({ field }) => (
                    <FormItem style={{ marginBottom: 0 }}>
                      <FormLabel>Link URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormGrid>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  Remove Service
                </Button>
              </div>
            </ArrayItemGrid>
          ))}
          {form.formState.errors.services && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{form.formState.errors.services.message}</p>}
        </div>
      </form>
    </Form>
  );
}
