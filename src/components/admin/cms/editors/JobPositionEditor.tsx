'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button, Divider } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
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
  AdminAlert as Alert,
  AdminAlertDescription as AlertDescription,
} from '@/components/admin/layout/AdminPrimitives';
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
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
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
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        if (mode === 'create') {
          const { id } = await createJobPosition(slugValue, data);
          router.push(`/admin/content/pages/careers/${id}`);
        } else {
          await saveJobPositionDraft(position!.id, data);
          setSuccessMsg('Draft saved.');
          router.refresh();
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to save draft.');
      }
    });
  };

  const onPublish = () => {
    if (!position) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        await publishJobPosition(position.id);
        setSuccessMsg('Published successfully.');
        router.refresh();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to publish.');
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

        {/* Alerts */}
        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
        {successMsg && (
          <Alert>
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

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
                    <Input placeholder="Video Editor" {...field} />
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
                    <Input placeholder="Creative" {...field} />
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
                    <SelectInput value={field.value} onChange={field.onChange}>
                      {JOB_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectInput>
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
                    <Input placeholder="Hồ Chí Minh" {...field} />
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
                    <Input placeholder="1-3 năm" {...field} />
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
                    <Input placeholder="Thoả thuận" {...field} />
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
                  <Textarea rows={2} placeholder="Mô tả ngắn về vị trí..." {...field} />
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
            {mode === 'create' ? 'Create Draft' : 'Save Draft'}
          </Button>
        </FooterRow>
      </FormStack>
    </Form>
  );
}

// ─── Dynamic string list sub-component ───────────────────────────────────────

interface DynamicStringListProps {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldArray: any;
  name: 'descriptions' | 'requirements' | 'benefits';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
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

      {fieldArray.fields.map((field: { id: string }, idx: number) => (
        <ItemCard key={field.id}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <FormField
                control={form.control}
                name={`${name}.${idx}`}
                render={({ field: inputField }: { field: React.InputHTMLAttributes<HTMLTextAreaElement> }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder={placeholder}
                        value={inputField.value as string}
                        onChange={inputField.onChange}
                        onBlur={inputField.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
              <Button
                size="small"
                icon={<ArrowUpOutlined />}
                type="text"
                disabled={idx === 0}
                onClick={() => fieldArray.move(idx, idx - 1)}
                title="Move up"
              />
              <Button
                size="small"
                icon={<ArrowDownOutlined />}
                type="text"
                disabled={idx === fieldArray.fields.length - 1}
                onClick={() => fieldArray.move(idx, idx + 1)}
                title="Move down"
              />
              <Button
                size="small"
                icon={<DeleteOutlined />}
                type="text"
                danger
                onClick={() => fieldArray.remove(idx)}
                title="Remove"
              />
            </div>
          </div>
        </ItemCard>
      ))}

      {fieldArray.fields.length === 0 && (
        <div style={{ color: '#999', fontSize: 13, padding: '8px 0' }}>
          No items yet. Click &ldquo;Add Item&rdquo; to add one.
        </div>
      )}
    </SectionStack>
  );
}
