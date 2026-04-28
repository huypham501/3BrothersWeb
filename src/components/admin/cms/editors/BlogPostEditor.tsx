'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button, Divider, Switch, Tooltip, Typography } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { blogPostFormSchema } from '@/lib/cms';
import type { CmsBlogPost } from '@/lib/cms';
import { saveBlogPostDraft, publishBlogPost, createBlogPostWithSlug } from '@/lib/cms/blog-actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminTextarea as Textarea } from '@/components/admin/controls/AdminTextarea';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { CmsFieldHint } from '@/components/admin/cms/ux/CmsFieldHint';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';
import {
  FooterRow,
  FormStack,
  HeaderRow,
  ItemCard,
  SectionHeaderRow,
  SectionStack,
  SectionTitle,
  TwoColumnGrid,
  ToggleFormItem,
} from './EditorLayout';
import { FormItem as RawFormItem } from '@/components/admin/controls/AdminForm';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';

type FormValues = z.infer<typeof blogPostFormSchema>;

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

export function BlogPostEditor({ post, mode, role, canPublish }: BlogPostEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, startPublishTransition] = useTransition();
  const [success, setSuccess] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [slug, setSlug] = React.useState(post?.slug ?? '');
  const [slugDirty, setSlugDirty] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: post?.title ?? '',
      badge: post?.badge ?? '',
      excerpt: post?.excerpt ?? '',
      cover_image_bg: post?.cover_image_bg ?? '',
      cover_image_url: post?.cover_image_url ?? '',
      cover_image_alt: post?.cover_image_alt ?? '',
      cover_aspect_ratio: post?.cover_aspect_ratio ?? '1440/710',
      content: post?.content?.length
        ? post.content
        : [{ id: 'intro', heading: null, body: '' }],
      mid_content: post?.mid_content ?? [],
      seo_title: post?.seo_title ?? '',
      seo_description: post?.seo_description ?? '',
      og_image: post?.og_image ?? '',
      keywords: post?.keywords ?? [],
      is_featured: post?.is_featured ?? false,
    },
  });

  const { fields: contentFields, append: appendContent, remove: removeContent, move: moveContent } = useFieldArray({
    control: form.control,
    name: 'content',
  });

  const { fields: midFields, append: appendMid, remove: removeMid, move: moveMid } = useFieldArray({
    control: form.control,
    name: 'mid_content',
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
    badge: data.badge ?? null,
    excerpt: data.excerpt ?? null,
    cover_image_bg: data.cover_image_bg ?? null,
    cover_image_url: data.cover_image_url ?? null,
    cover_image_alt: data.cover_image_alt ?? null,
    cover_aspect_ratio: data.cover_aspect_ratio ?? null,
    seo_title: data.seo_title ?? null,
    seo_description: data.seo_description ?? null,
    og_image: data.og_image ?? null,
  });

  const onSaveDraft = async (data: FormValues) => {
    setIsSaving(true);
    setSuccess(null);
    setErrorMsg(null);
    try {
      if (mode === 'create') {
        if (!slug) {
          setErrorMsg('Slug is required. It will be auto-derived from the title.');
          return;
        }
        const created = await createBlogPostWithSlug(slug, normalizePayload(data));
        setSuccess('Blog post created successfully!');
        setTimeout(() => router.push(`/admin/content/pages/blogs/${created.id}`), 1500);
      } else if (post) {
        await saveBlogPostDraft(post.id, normalizePayload(data));
        setSuccess('Draft saved successfully.');
        setTimeout(() => setSuccess(null), 3000);
        form.reset(data);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = () => {
    if (!post) return;
    startPublishTransition(async () => {
      try {
        // First save current form state as draft
        const data = form.getValues();
        await saveBlogPostDraft(post.id, normalizePayload(data));
        await publishBlogPost(post.id);
        setSuccess('Published successfully!');
        setTimeout(() => setSuccess(null), 3000);
        router.refresh();
      } catch (err) {
        setErrorMsg((err as Error).message);
      }
    });
  };

  const hasUnpublished = post?.has_unpublished_changes ?? true;
  const keywordsString = form.watch('keywords').join(', ');
  const ux = (fieldPath: string) => getCmsFieldUxSpec('blog_post', fieldPath);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Status bar — only in edit mode */}
      {mode === 'edit' && post && (
        <CmsEditorStatusBar
          pageTitle={post.title}
          hasUnpublished={hasUnpublished}
          lastEditedBy={post.last_edited_by_identifier}
          lastEditedAt={post.last_edited_at}
          lastPublishedBy={post.last_published_by_identifier}
          lastPublishedAt={post.last_published_at}
          role={role}
          canPublish={canPublish}
          isPublishing={isPublishing}
          onPublish={handlePublish}
          publishLabel="Publish Post"
        />
      )}

      <Form {...form}>
        <FormStack onSubmit={form.handleSubmit(onSaveDraft)}>
          {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
          {success && <Alert variant="success"><AlertDescription>{success}</AlertDescription></Alert>}

          {/* ── Header row ── */}
          <HeaderRow>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {mode === 'create' ? 'New Blog Post' : 'Edit Blog Post'}
            </Typography.Title>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {mode === 'edit' && canPublish && (
                <Button
                  icon={<SendOutlined />}
                  onClick={handlePublish}
                  disabled={isPublishing}
                  loading={isPublishing}
                  style={{ background: '#7c3aed', borderColor: '#7c3aed', color: '#fff' }}
                >
                  Publish
                </Button>
              )}
              <Button type="primary" htmlType="submit" loading={isSaving} disabled={isSaving || (!form.formState.isDirty && mode === 'edit')}>
                {isSaving ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Save Draft'}
              </Button>
            </div>
          </HeaderRow>

          {/* ── Featured toggle ── */}
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

          {/* ── Slug field (create mode) ── */}
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

          {/* ── Core fields ── */}
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl><Textarea {...field} rows={2} placeholder="Post title" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <TwoColumnGrid>
            <FormField control={form.control} name="badge" render={({ field }) => (
              <FormItem>
                <FormLabel>Badge</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ''} placeholder="e.g. Event • Sắp diễn ra" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TwoColumnGrid>

          <FormField control={form.control} name="excerpt" render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl><Textarea {...field} value={field.value ?? ''} rows={3} placeholder="Short description shown in post cards" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* ── Cover image ── */}
          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13 }}>Cover Image</Divider>
          <TwoColumnGrid>
            <FormField control={form.control} name="cover_image_url" render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ''} placeholder="https://..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cover_image_alt" render={({ field }) => (
              <FormItem>
                <FormLabel>Image Alt Text</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ''} placeholder="Describe the image" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </TwoColumnGrid>
          <FormField control={form.control} name="cover_image_bg" render={({ field }) => (
            <FormItem>
              <FormLabel>
                Cover Gradient Fallback{' '}
                <Tooltip title="CSS background-image value used when no image URL is set. E.g. linear-gradient(135deg, #003CA6 0%, #1a56c4 100%)">
                  <span style={{ cursor: 'help', color: '#999', fontSize: 12 }}>(?)</span>
                </Tooltip>
              </FormLabel>
              <FormControl><Input {...field} value={field.value ?? ''} placeholder="linear-gradient(...)" style={{ fontFamily: 'monospace', fontSize: 12 }} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="cover_aspect_ratio" render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Aspect Ratio (W/H)</FormLabel>
              <FormControl><Input {...field} value={field.value ?? ''} placeholder="1440/710" style={{ fontFamily: 'monospace', fontSize: 12 }} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* ── Main content sections ── */}
          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13 }}>Article Content</Divider>
          <SectionStack>
            <SectionHeaderRow>
              <SectionTitle>Sections</SectionTitle>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                size="small"
                onClick={() => appendContent({ id: `section-${Date.now()}`, heading: null, body: '' })}
              >
                Add Section
              </Button>
            </SectionHeaderRow>

            {contentFields.map((field, index) => (
              <ItemCard key={field.id}>
                <SectionHeaderRow>
                  <Typography.Text strong style={{ fontSize: 13 }}>Section {index + 1}</Typography.Text>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => moveContent(index, index - 1)} type="text" />
                    <Button size="small" icon={<ArrowDownOutlined />} disabled={index === contentFields.length - 1} onClick={() => moveContent(index, index + 1)} type="text" />
                    <Button size="small" icon={<DeleteOutlined />} danger onClick={() => removeContent(index)} type="text" />
                  </div>
                </SectionHeaderRow>

                <FormField control={form.control} name={`content.${index}.id`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ux('content.id').label ?? 'Section ID'}</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. intro, research" style={{ fontFamily: 'monospace', fontSize: 12 }} /></FormControl>
                    <CmsFieldHint formId="blog_post" fieldPath="content.id" />
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name={`content.${index}.heading`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heading <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} placeholder="Section heading" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name={`content.${index}.body`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body *</FormLabel>
                    <FormControl><Textarea {...field} rows={6} placeholder="Article content..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </ItemCard>
            ))}
          </SectionStack>

          {/* ── Mid content sections ── */}
          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13 }}>Mid-Page Sections <span style={{ fontWeight: 400, color: '#888' }}>(after cover image break)</span></Divider>
          <SectionStack>
            <SectionHeaderRow>
              <SectionTitle>Mid Sections</SectionTitle>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                size="small"
                onClick={() => appendMid({ id: `mid-${Date.now()}`, heading: '', body: '' })}
              >
                Add Mid Section
              </Button>
            </SectionHeaderRow>

            {midFields.map((field, index) => (
              <ItemCard key={field.id}>
                <SectionHeaderRow>
                  <Typography.Text strong style={{ fontSize: 13 }}>Mid Section {index + 1}</Typography.Text>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => moveMid(index, index - 1)} type="text" />
                    <Button size="small" icon={<ArrowDownOutlined />} disabled={index === midFields.length - 1} onClick={() => moveMid(index, index + 1)} type="text" />
                    <Button size="small" icon={<DeleteOutlined />} danger onClick={() => removeMid(index)} type="text" />
                  </div>
                </SectionHeaderRow>

                <FormField control={form.control} name={`mid_content.${index}.id`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ux('mid_content.id').label ?? 'Section ID'}</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. packing, health" style={{ fontFamily: 'monospace', fontSize: 12 }} /></FormControl>
                    <CmsFieldHint formId="blog_post" fieldPath="mid_content.id" />
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name={`mid_content.${index}.heading`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heading *</FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} placeholder="Section heading" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name={`mid_content.${index}.body`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body *</FormLabel>
                    <FormControl><Textarea {...field} rows={5} placeholder="Article content..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </ItemCard>
            ))}
            {midFields.length === 0 && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>No mid-page sections. Add one if your article has a second half after the cover image break.</Typography.Text>
            )}
          </SectionStack>

          {/* ── SEO ── */}
          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13 }}>SEO</Divider>

          <FormField control={form.control} name="seo_title" render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Title</FormLabel>
              <FormControl><Input {...field} value={field.value ?? ''} placeholder="Post Title | 3BROTHERS NETWORK" maxLength={70} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="seo_description" render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Description</FormLabel>
              <FormControl><Textarea {...field} value={field.value ?? ''} rows={2} placeholder="Meta description, max 160 characters" maxLength={160} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <TwoColumnGrid>
            <FormField control={form.control} name="og_image" render={({ field }) => (
              <FormItem>
                <FormLabel>OG Image URL</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ''} placeholder="https://..." /></FormControl>
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

          {/* ── Footer save ── */}
          <FooterRow>
            <Button type="primary" htmlType="submit" loading={isSaving} disabled={isSaving || (!form.formState.isDirty && mode === 'edit')}>
              {isSaving ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Save Draft'}
            </Button>
          </FooterRow>
        </FormStack>
      </Form>
    </div>
  );
}
