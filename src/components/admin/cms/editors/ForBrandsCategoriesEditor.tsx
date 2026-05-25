'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CmsPageSection, forBrandsCategoriesSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';
import { ErrorText, FormStack, HeaderRow, SectionStack, ToggleFormItem } from './EditorLayout';

type FormValues = {
  enabled: boolean;
  categories: Array<{ label: string }>;
};

const formSchema = z.object({
  enabled: z.boolean(),
  categories: z.array(z.object({ label: z.string().max(60) })).min(1).max(40),
});

function normalizeText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

export function ForBrandsCategoriesEditor({
  pageId,
  section,
}: {
  pageId: string;
  section: CmsPageSection<z.infer<typeof forBrandsCategoriesSchema>>;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: section.enabled,
      categories: Array.isArray(section.content?.categories)
        ? section.content.categories.map((item: unknown) => ({ label: normalizeText(item) }))
        : [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'categories',
  });

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(false);
    setErrorMsg(null);
    try {
      const payload = {
        categories: data.categories.map((item) => item.label),
      };

      const parsed = forBrandsCategoriesSchema.safeParse(payload);
      if (!parsed.success) {
        setErrorMsg(parsed.error.issues[0]?.message || 'Invalid categories payload.');
        return;
      }

      await savePageSection(pageId, section.schema_key, parsed.data, data.enabled);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      form.reset(data);
      router.refresh();
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
        {success && <Alert variant="success"><AlertDescription>For Brands Categories saved successfully.</AlertDescription></Alert>}

        <HeaderRow>
          <FormField control={form.control} name="enabled" render={({ field }) => (
            <ToggleFormItem>
              <FormLabel>Enable Section</FormLabel>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </ToggleFormItem>
          )} />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Section'}
          </Button>
        </HeaderRow>

        <SectionStack>
          <CmsSortableList
            title={`Categories (${fields.length}/40)`}
            items={fields.map((item, index) => ({ key: item.id, value: index }))}
            onMove={move}
            onRemove={remove}
            onAdd={() => append({ label: '' })}
            addLabel="Add Category"
            renderItem={({ item }) => {
              const index = item.value;
              return (
                <FormField control={form.control} name={`categories.${index}.label`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Label</FormLabel>
                    <FormControl><Input {...field} maxLength={60} showCount /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              );
            }}
          />
          {form.formState.errors.categories && <ErrorText>{form.formState.errors.categories.message as string}</ErrorText>}
        </SectionStack>
      </FormStack>
    </Form>
  );
}
