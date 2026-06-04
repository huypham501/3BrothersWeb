'use client';

import * as React from 'react';
import {
  useForm,
  useFieldArray,
  type UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button, Divider } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { jobPositionContentSchema } from '@/lib/cms/schemas';
import type { CmsJobPosition } from '@/lib/cms';
import {
  createJobPosition,
  saveJobPositionDraft,
  publishJobPosition,
} from '@/lib/cms/careers-actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import {
  CmsActionFeedback,
  useCmsActionFeedback,
} from '@/components/admin/cms/CmsActionFeedback';
import {
  FooterRow,
  FormStack,
  ItemCard,
  SectionHeaderRow,
  SectionStack,
  SectionTitle,
  TwoColumnGrid,
  SelectInput,
} from './EditorLayout';
import { FormItem as RawFormItem } from '@/components/admin/controls/AdminForm';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';

type FormValues = z.infer<typeof jobPositionContentSchema>;

interface JobPositionEditorProps {
  position?: CmsJobPosition;
  mode: 'create' | 'edit';
  role: string;
  canPublish: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Freelance', 'Internship', 'Contract'];

export function JobPositionEditor({
  position,
  mode,
  role,
  canPublish,
}: JobPositionEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { feedback, showSuccess, showError, clearFeedback } = useCmsActionFeedback();
  const [slugValue, setSlugValue] = React.useState(position?.slug ?? '');

  const defaultContent = position?.content ?? {
    title: '',
    department: '',
    type: 'Full-time',
    location: '',
    experience: '',
    salary: '',
    short_description: '',
    descriptions: [''],
    requirements: [''],
    benefits: [''],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(jobPositionContentSchema),
    defaultValues: defaultContent,
  });

  // Dynamic field arrays
  const descriptionsArray = useFieldArray({ control: form.control, name: 'descriptions' as never });
  const requirementsArray = useFieldArray({ control: form.control, name: 'requirements' as never });
  const benefitsArray = useFieldArray({ control: form.control, name: 'benefits' as never });

  // Auto-derive slug in create mode
  const watchTitle = form.watch('title');
  React.useEffect(() => {
    if (mode === 'create') {
      setSlugValue(slugify(watchTitle));
    }
  }, [watchTitle, mode]);

  const onSaveDraft = (data: FormValues) => {
    clearFeedback();
    startTransition(async () => {
      try {
        if (mode === 'create') {
          const { id } = await createJobPosition(slugValue, data);
          router.push(`/admin/content/pages/careers/${id}`);
        } else {
          await saveJobPositionDraft(position!.id, data);
          showSuccess('Draft saved. Changes are not live until publish.');
          router.refresh();
        }
      } catch (err) {
        showError(err, 'Failed to save draft.');
      }
    });
  };

  const onPublish = () => {
    if (!position) return;
    clearFeedback();
    startTransition(async () => {
      try {
        await publishJobPosition(position.id);
        showSuccess('Published successfully.');
        router.refresh();
      } catch (err) {
        showError(err, 'Failed to publish. Please try again.');
      }
    });
  };

  return (
    <Form {...form}>
      <FormStack onSubmit={form.handleSubmit(onSaveDraft)}>
        {/* Status bar — edit mode only */}
        {mode === 'edit' && position && (
          <CmsEditorStatusBar
            pageTitle={position.title}
            hasUnpublished={position.has_unpublished_changes}
            lastEditedBy={position.last_edited_by_identifier ?? null}
            lastEditedAt={position.last_edited_at ?? null}
            lastPublishedBy={position.last_published_by_identifier ?? null}
            lastPublishedAt={position.last_published_at ?? null}
            role={role}
            canPublish={canPublish}
            isPublishing={isPending}
            onPublish={onPublish}
          />
        )}

        <CmsActionFeedback feedback={feedback} />

        {/* Slug preview (create mode) */}
        {mode === 'create' && (
          <RawFormItem>
            <FormLabel>Slug (auto-generated)</FormLabel>
            <div
              style={{
                padding: '8px 12px',
                background: '#f5f5f5',
                borderRadius: 8,
                fontSize: 13,
                color: '#555',
                fontFamily: 'monospace',
              }}
            >
              /careers/{slugValue || '...'}
            </div>
          </RawFormItem>
        )}

        {/* Basic info */}
        <SectionStack>
          <SectionTitle>Basic Information</SectionTitle>

          <TwoColumnGrid>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Video Editor" {...field} maxLength={200} showCount />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Creative" {...field} maxLength={80} showCount />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <SelectInput
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      options={JOB_TYPES.map((t) => ({ label: t, value: t }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Hồ Chí Minh" {...field} maxLength={120} showCount />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Required</FormLabel>
                  <FormControl>
                    <Input placeholder="1-3 năm" {...field} maxLength={120} showCount />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input placeholder="Thoả thuận" {...field} maxLength={120} showCount />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TwoColumnGrid>

          <FormField
            control={form.control}
            name="short_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description (shown in job card)</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Mô tả ngắn về vị trí..." {...field} maxLength={400} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionStack>

        <Divider />

        {/* Job Descriptions */}
        <DynamicStringList
          label="Job Descriptions"
          fieldArray={descriptionsArray}
          name="descriptions"
          form={form}
          placeholder="Mô tả công việc..."
        />

        <Divider />

        {/* Requirements */}
        <DynamicStringList
          label="Requirements"
          fieldArray={requirementsArray}
          name="requirements"
          form={form}
          placeholder="Yêu cầu..."
        />

        <Divider />

        {/* Benefits */}
        <DynamicStringList
          label="Benefits"
          fieldArray={benefitsArray}
          name="benefits"
          form={form}
          placeholder="Quyền lợi..."
        />

        <Divider />

        {/* Footer */}
        <FooterRow>
          <Button htmlType="submit" loading={isPending} style={{ minWidth: 120 }}>
            {mode === 'create' ? 'Create Position' : 'Save Draft'}
          </Button>
        </FooterRow>
      </FormStack>
    </Form>
  );
}

// ─── Dynamic string list sub-component ───────────────────────────────────────

interface DynamicStringListProps {
  label: string;
  name: 'descriptions' | 'requirements' | 'benefits';
  fieldArray: {
    fields: Array<{ id: string }>;
    append: (value: string) => void;
    move: (from: number, to: number) => void;
    remove: (index: number) => void;
  };
  form: UseFormReturn<FormValues>;
  placeholder?: string;
}

function DynamicStringList({
  label,
  fieldArray,
  name,
  form,
  placeholder,
}: DynamicStringListProps) {
  return (
    <SectionStack>
      <SectionHeaderRow>
        <SectionTitle>{label}</SectionTitle>
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={() => fieldArray.append('')}
          type="dashed"
        >
          Add Item
        </Button>
      </SectionHeaderRow>

      <CmsSortableList
        title={`${label} (${fieldArray.fields.length})`}
        items={fieldArray.fields.map((field, idx) => ({ key: field.id, value: idx }))}
        onMove={fieldArray.move}
        onRemove={fieldArray.remove}
        renderItem={({ item }) => {
          const idx = item.value;
          return (
            <ItemCard key={item.key}>
              <FormField
                control={form.control}
                name={`${name}.${idx}` as const}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder={placeholder}
                        maxLength={500}
                        showCount
                        value={inputField.value as string}
                        onChange={inputField.onChange}
                        onBlur={inputField.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ItemCard>
          );
        }}
      />

      {fieldArray.fields.length === 0 && (
        <div style={{ color: '#999', fontSize: 13, padding: '8px 0' }}>
          No items yet. Click &ldquo;Add Item&rdquo; to add one.
        </div>
      )}
    </SectionStack>
  );
}
