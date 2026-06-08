'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button, Switch, Typography } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import { blogPostFormSchema } from '@/lib/cms';
import type { CmsBlogPost } from '@/lib/cms';
import { saveBlogPostDraft, publishBlogPost, createBlogPostWithSlug } from '@/lib/cms/blog-actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminImageUpload } from '@/components/admin/controls/AdminImageUpload';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import {
  AdminAlert as Alert,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
  AdminCardTitle,
} from '@/components/admin/layout/AdminPrimitives';
import { CmsFieldHint } from '@/components/admin/cms/ux/CmsFieldHint';
import { CmsSortableList } from '@/components/admin/cms/ux/CmsSortableList';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';
import {
  FormStack,
  HeaderRow,
  SectionHeaderRow,
  SectionStack,
  SectionTitle,
  TwoColumnGrid,
  ToggleFormItem,
} from './EditorLayout';
import { FormItem as RawFormItem } from '@/components/admin/controls/AdminForm';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';
import { CmsActionFeedback, useCmsActionFeedback } from '@/components/admin/cms/CmsActionFeedback';

type FormValues = z.infer<typeof blogPostFormSchema>;
type BlogSection = FormValues['content'][number];

interface BlogPostEditorProps {
  /** Existing post for edit mode. Omit for create mode. */
  post?: CmsBlogPost;
  /** Must be provided for create mode. */
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

function makeUniqueSectionId(baseId: string, usedIds: Set<string>): string {
  let nextId = baseId;
  let suffix = 2;

  while (usedIds.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(nextId);
  return nextId;
}

function normalizeSectionForEditor(section: BlogSection, usedIds: Set<string>): BlogSection[] {
  const type = section.type ?? 'text';

  if (type === 'image') {
    return [{
      type: 'image',
      id: makeUniqueSectionId(section.id, usedIds),
      heading: null,
      body: null,
      image_url: section.image_url ?? '',
      image_alt: section.image_alt ?? '',
      image_caption: section.image_caption ?? '',
    }];
  }

  const textBlock: BlogSection = {
    type: 'text',
    id: makeUniqueSectionId(section.id, usedIds),
    heading: section.heading ?? null,
    body: section.body ?? '',
  };

  if (!section.image_url) return [textBlock];

  const imageBlock: BlogSection = {
    type: 'image',
    id: makeUniqueSectionId(`${section.id}-image`, usedIds),
    heading: null,
    body: null,
    image_url: section.image_url,
    image_alt: section.image_alt ?? '',
    image_caption: section.image_caption ?? '',
  };

  return section.image_position === 'before_body'
    ? [imageBlock, textBlock]
    : [textBlock, imageBlock];
}

function getInitialContent(post?: CmsBlogPost): BlogSection[] {
  const mergedContent: BlogSection[] = [
    ...(post?.content ?? []),
    ...(post?.mid_content ?? []),
  ];
  const usedIds = new Set<string>();
  const sections = mergedContent.flatMap((section) => normalizeSectionForEditor(section, usedIds));

  return sections.length
    ? sections
    : [{ type: 'text', id: 'intro', heading: null, body: '' }];
}

function normalizeSectionsForSave(sections: BlogSection[]): BlogSection[] {
  return sections.map((section) => {
    const type = section.type ?? 'text';

    if (type === 'image') {
      return {
        type: 'image',
        id: section.id,
        heading: null,
        body: null,
        image_url: section.image_url ?? '',
        image_alt: section.image_alt ?? null,
        image_caption: section.image_caption ?? null,
      };
    }

    return {
      type: 'text',
      id: section.id,
      heading: section.heading ?? null,
      body: section.body ?? '',
    };
  });
}

export function BlogPostEditor({ post, mode, role, canPublish }: BlogPostEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, startPublishTransition] = useTransition();
  const { feedback, showSuccess, showError, showWarning, clearFeedback } = useCmsActionFeedback();
  const [slug, setSlug] = React.useState(post?.slug ?? '');
  const [slugDirty, setSlugDirty] = React.useState(false);
  const [statusState, setStatusState] = React.useState({
    hasUnpublished: post?.has_unpublished_changes ?? true,
    lastPublishedBy: post?.last_published_by_identifier ?? null,
    lastPublishedAt: post?.last_published_at ?? null,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: post?.title ?? '',
      badge: post?.badge ?? '',
      excerpt: post?.excerpt ?? '',
      cover_image_url: post?.cover_image_url ?? '',
      cover_image_alt: post?.cover_image_alt ?? '',
      content: getInitialContent(post),
      mid_content: [],
      seo_title: post?.seo_title ?? '',
      seo_description: post?.seo_description ?? '',
      og_image: post?.og_image ?? '',
      keywords: post?.keywords ?? [],
      is_featured: post?.is_featured ?? false,
    },
  });

  React.useEffect(() => {
    setStatusState({
      hasUnpublished: post?.has_unpublished_changes ?? true,
      lastPublishedBy: post?.last_published_by_identifier ?? null,
      lastPublishedAt: post?.last_published_at ?? null,
    });
  }, [
    post?.id,
    post?.has_unpublished_changes,
    post?.last_published_by_identifier,
    post?.last_published_at,
  ]);

  const { fields: contentFields, append: appendContent, remove: removeContent, move: moveContent } = useFieldArray({
    control: form.control,
    name: 'content',
  });

  // Auto-derive slug from title in create mode
  const watchedTitle = form.watch('title');
  React.useEffect(() => {
    if (mode === 'create' && !slugDirty && watchedTitle) {
      setSlug(slugify(watchedTitle));
    }
  }, [watchedTitle, mode, slugDirty]);

  // react-hook-form returns undefined for optional fields; actions require null
  const normalizePayload = (data: FormValues): import('@/lib/cms').BlogPostFormPayload => ({
    ...data,
    content: normalizeSectionsForSave(data.content),
    mid_content: [],
    badge: data.badge ?? null,
    excerpt: data.excerpt ?? null,
    cover_image_url: data.cover_image_url ?? null,
    cover_image_alt: data.cover_image_alt ?? null,
    seo_title: data.seo_title ?? null,
    seo_description: data.seo_description ?? null,
    og_image: data.og_image ?? null,
  });

  const onSaveDraft = async (data: FormValues) => {
    setIsSaving(true);
    clearFeedback();
    try {
      if (mode === 'create') {
        if (!slug) {
          showWarning('Slug is required. It will be auto-derived from the title.');
          return;
        }
        const created = await createBlogPostWithSlug(slug, normalizePayload(data));
        showSuccess('Blog post created successfully.');
        setTimeout(() => router.push(`/admin/content/pages/blogs/${created.id}`), 1500);
      } else if (post) {
        await saveBlogPostDraft(post.id, normalizePayload(data));
        setStatusState((current) => ({ ...current, hasUnpublished: true }));
        showSuccess('Draft saved. Changes are not live until publish.');
        form.reset(data);
        router.refresh();
      }
    } catch (err) {
      showError(err, 'Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = () => {
    if (!post) return;
    startPublishTransition(async () => {
      clearFeedback();
      try {
        // First save current form state as draft
        const data = form.getValues();
        await saveBlogPostDraft(post.id, normalizePayload(data));
        const published = await publishBlogPost(post.id);
        // Clear dirty state immediately so Publish button disables after success.
        form.reset(data);
        setStatusState({
          hasUnpublished: published.has_unpublished_changes,
          lastPublishedBy: published.last_published_by_identifier,
          lastPublishedAt: published.last_published_at,
        });
        showSuccess('Published successfully.');
        router.refresh();
      } catch (err) {
        showError(err, 'Failed to publish. Please try again.');
      }
    });
  };

  const hasUnpublished = statusState.hasUnpublished;
  const canPublishNow = hasUnpublished || form.formState.isDirty;
  const keywordsString = form.watch('keywords').join(', ');
  const ux = (fieldPath: string) => getCmsFieldUxSpec('blog_post', fieldPath);
  const appendTextSection = () => appendContent({ type: 'text', id: `section-${Date.now()}`, heading: null, body: '' });
  const appendImageSection = () => appendContent({ type: 'image', id: `image-${Date.now()}`, heading: null, body: null, image_url: '', image_alt: '', image_caption: '' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Status bar — only in edit mode */}
      {mode === 'edit' && post && (
        <CmsEditorStatusBar
          pageTitle={post.title}
          hasUnpublished={canPublishNow}
          lastEditedBy={post.last_edited_by_identifier}
          lastEditedAt={post.last_edited_at}
          lastPublishedBy={statusState.lastPublishedBy}
          lastPublishedAt={statusState.lastPublishedAt}
          role={role}
          canPublish={canPublish}
          isPublishing={isPublishing}
          onPublish={handlePublish}
          publishLabel="Publish Post"
        />
      )}

      <Form {...form}>
        <FormStack onSubmit={form.handleSubmit(onSaveDraft)}>
          <CmsActionFeedback feedback={feedback} />

          {/* ── Header row ── */}
          <HeaderRow>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {mode === 'create' ? 'New Blog Post' : 'Edit Blog Post'}
            </Typography.Title>
            <Button type="primary" htmlType="submit" loading={isSaving} disabled={isSaving || (!form.formState.isDirty && mode === 'edit')}>
              {isSaving ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Save Draft'}
            </Button>
          </HeaderRow>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>General</AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent>
              <SectionStack>
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <ToggleFormItem>
                      <FormLabel>{ux('is_featured').label ?? 'Featured Post'}</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          checkedChildren="Featured"
                          unCheckedChildren="Normal"
                        />
                      </FormControl>
                      <CmsFieldHint formId="blog_post" fieldPath="is_featured" />
                    </ToggleFormItem>
                  )}
                />

                {mode === 'create' && (
                  <RawFormItem>
                    <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Slug <span style={{ color: '#888', fontWeight: 400 }}>(URL path, auto-derived from title)</span>
                    </label>
                    <Input
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugDirty(true);
                      }}
                      placeholder="my-post-slug"
                      style={{ fontFamily: 'monospace' }}
                    />
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Will be: /blogs/{slug || '...'}
                    </Typography.Text>
                  </RawFormItem>
                )}

                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl><Textarea {...field} rows={2} placeholder="Post title" maxLength={200} showCount /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <TwoColumnGrid>
                  <FormField control={form.control} name="badge" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} placeholder="e.g. Event • Sắp diễn ra" maxLength={60} showCount /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </TwoColumnGrid>

                <FormField control={form.control} name="excerpt" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl><Textarea {...field} value={field.value ?? ''} rows={3} placeholder="Short description shown in post cards" maxLength={300} showCount /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </SectionStack>
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>SEO</AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent>
              <SectionStack>
                <FormField control={form.control} name="seo_title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Title</FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''} placeholder="Post Title | 3BROTHERS NETWORK" maxLength={70} showCount /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="seo_description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Description</FormLabel>
                    <FormControl><Textarea {...field} value={field.value ?? ''} rows={2} placeholder="Meta description, max 160 characters" maxLength={160} showCount /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <TwoColumnGrid>
                  <FormField control={form.control} name="og_image" render={({ field }) => (
                    <FormItem>
                      <FormLabel>OG Image URL</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} placeholder="https://..." maxLength={1024} showCount /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <RawFormItem>
                    <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                      Keywords{' '}
                      <span style={{ fontWeight: 400, color: '#888' }}>(comma-separated)</span>
                    </label>
                    <Input
                      value={keywordsString}
                      onChange={(e) => {
                        const kw = e.target.value.split(',').map((k) => k.trim()).filter(Boolean);
                        form.setValue('keywords', kw, { shouldDirty: true });
                      }}
                      placeholder="media, influence, creator"
                    />
                  </RawFormItem>
                </TwoColumnGrid>
              </SectionStack>
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Cover Image</AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent>
              <SectionStack>
                <TwoColumnGrid>
                  <FormField control={form.control} name="cover_image_url" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <AdminImageUpload
                          value={field.value}
                          onChange={(nextUrl) => {
                            form.setValue('cover_image_url', nextUrl, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                          label="Cover Image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="cover_image_alt" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Alt Text</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} placeholder="Describe the image" maxLength={125} showCount /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </TwoColumnGrid>
                <Alert
                  message="Cover Ratio is Fixed by Design"
                  description="Design aspect ratio: 1440/710. Recommended upload size: 1440x710 (or larger with same ratio)."
                />
              </SectionStack>
            </AdminCardContent>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Article Content</AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent>
              <SectionStack>
            <SectionHeaderRow>
              <SectionTitle>Sections</SectionTitle>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={appendTextSection}
                >
                  Add Text
                </Button>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={appendImageSection}
                >
                  Add Image
                </Button>
              </div>
            </SectionHeaderRow>

            <CmsSortableList
              title={`Sections (${contentFields.length})`}
              items={contentFields.map((field, index) => ({ key: field.id, value: index }))}
              onMove={moveContent}
              onRemove={removeContent}
              renderItem={({ item }) => {
                const index = item.value;
                const sectionType = form.watch(`content.${index}.type`) ?? 'text';
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <SectionHeaderRow>
                      <Typography.Text strong style={{ fontSize: 13 }}>
                        {sectionType === 'image' ? 'Image' : 'Text'} Section {index + 1}
                      </Typography.Text>
                    </SectionHeaderRow>

                    <FormField control={form.control} name={`content.${index}.id`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ux('content.id').label ?? 'Section ID'}</FormLabel>
                        <FormControl><Input {...field} placeholder={sectionType === 'image' ? 'e.g. itinerary-image' : 'e.g. intro, research'} maxLength={60} showCount style={{ fontFamily: 'monospace', fontSize: 12 }} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {sectionType === 'image' ? (
                      <>
                        <FormField control={form.control} name={`content.${index}.image_url`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image *</FormLabel>
                            <FormControl>
                              <AdminImageUpload
                                value={field.value}
                                onChange={(nextUrl) => {
                                  form.setValue(`content.${index}.image_url`, nextUrl, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  });
                                }}
                                label="Section Image"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <TwoColumnGrid>
                          <FormField control={form.control} name={`content.${index}.image_alt`} render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alt Text</FormLabel>
                              <FormControl><Input {...field} value={field.value ?? ''} placeholder="Describe the image" maxLength={125} showCount /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name={`content.${index}.image_caption`} render={({ field }) => (
                            <FormItem>
                              <FormLabel>Caption</FormLabel>
                              <FormControl><Input {...field} value={field.value ?? ''} placeholder="Optional caption shown under image" maxLength={180} showCount /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </TwoColumnGrid>
                      </>
                    ) : (
                      <>
                        <FormField control={form.control} name={`content.${index}.heading`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heading <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></FormLabel>
                            <FormControl><Input {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} placeholder="Section heading" maxLength={120} showCount /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name={`content.${index}.body`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Body *</FormLabel>
                            <FormControl><Textarea {...field} value={field.value ?? ''} rows={6} placeholder="Article content..." /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </>
                    )}
                  </div>
                );
              }}
            />
              </SectionStack>
            </AdminCardContent>
          </AdminCard>


        </FormStack>
      </Form>
    </div>
  );
}
