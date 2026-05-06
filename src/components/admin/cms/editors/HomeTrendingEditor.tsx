'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CmsBlogPost, CmsPageSection, homeTrendingSchema } from '@/lib/cms';
import { savePageSection } from '@/lib/cms/actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import { AdminButton as Button } from '@/components/admin/layout/AdminPrimitives';
import { AdminSwitch as Switch } from '@/components/admin/controls/AdminSwitch';
import { AdminAlert as Alert, AdminAlertDescription as AlertDescription } from '@/components/admin/layout/AdminPrimitives';
import { CmsFieldHint } from '@/components/admin/cms/ux/CmsFieldHint';
import { getCmsFieldUxSpec } from '@/lib/cms/ux/field-ux-spec';
import {
  ErrorText,
  FooterRow,
  FormStack,
  HeaderRow,
  ItemCard,
  SectionHeaderRow,
  SectionStack,
  SectionTitle,
  ToggleFormItem,
  TwoColumnGrid,
} from './EditorLayout';
import { z } from 'zod';

type FormValues = z.infer<typeof homeTrendingSchema> & { enabled: boolean };
const homeTrendingFormSchema = z.object({ enabled: z.boolean() }).and(homeTrendingSchema);

export function HomeTrendingEditor({
  pageId,
  section,
  publishedBlogPosts,
}: {
  pageId: string;
  section: CmsPageSection<z.infer<typeof homeTrendingSchema>>;
  publishedBlogPosts: CmsBlogPost[];
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [selectedPostIdToAdd, setSelectedPostIdToAdd] = React.useState('');
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(homeTrendingFormSchema),
    defaultValues: {
      enabled: section.enabled,
      section_title: section.content.section_title || '',
      view_all_label: section.content.view_all_label || '',
      view_all_url: section.content.view_all_url || '',
      mode: 'manual',
      limit: section.content.limit || 3,
      selected_post_ids: section.content.selected_post_ids || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'selected_post_ids',
  });

  const watchedSelectedIds = form.watch('selected_post_ids');
  const selectedIds = React.useMemo(() => watchedSelectedIds ?? [], [watchedSelectedIds]);
  const limit = form.watch('limit') || 3;
  const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);

  const postById = React.useMemo(
    () => new Map(publishedBlogPosts.map((post) => [post.id, post])),
    [publishedBlogPosts]
  );

  const availablePosts = React.useMemo(
    () => publishedBlogPosts.filter((post) => !selectedSet.has(post.id)),
    [publishedBlogPosts, selectedSet]
  );
  const filteredAvailablePosts = React.useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return availablePosts;
    return availablePosts.filter((post) =>
      `${post.title} ${post.slug}`.toLowerCase().includes(keyword)
    );
  }, [availablePosts, searchKeyword]);

  const invalidSelectedIds = React.useMemo(
    () => selectedIds.filter((id) => !postById.has(id)),
    [selectedIds, postById]
  );

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
      router.refresh();
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPost = () => {
    if (!selectedPostIdToAdd) return;
    if (selectedSet.has(selectedPostIdToAdd)) return;
    if (selectedIds.length >= limit) {
      setErrorMsg(`Selected posts reached limit (${limit}). Increase limit or remove one.`);
      return;
    }

    append(selectedPostIdToAdd);
    setSelectedPostIdToAdd('');
    setErrorMsg(null);
  };

  const ux = (fieldPath: string) => getCmsFieldUxSpec('home_trending', fieldPath);

  return (
    <Form {...form}>
      <FormStack onSubmit={form.handleSubmit(onSubmit)}>
        {errorMsg && <Alert variant="destructive"><AlertDescription>{errorMsg}</AlertDescription></Alert>}
        {success && <Alert variant="success"><AlertDescription>Trending section saved successfully.</AlertDescription></Alert>}
        {invalidSelectedIds.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              {`Found ${invalidSelectedIds.length} invalid selected post reference(s). Please remove or replace them before publish.`}
            </AlertDescription>
          </Alert>
        )}

        <HeaderRow>
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <ToggleFormItem>
                <FormLabel>Enable Section</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </ToggleFormItem>
            )}
          />
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? 'Saving...' : 'Save Section'}
          </Button>
        </HeaderRow>

        <TwoColumnGrid>
          <FormField
            control={form.control}
            name="section_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Title</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={80} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{ux('limit').label ?? 'Trending Limit'}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value ?? 3}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <CmsFieldHint formId="home_trending" fieldPath="limit" />
                <FormMessage />
              </FormItem>
            )}
          />
        </TwoColumnGrid>

        <TwoColumnGrid>
          <FormField
            control={form.control}
            name="view_all_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>View All Label</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={40} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="view_all_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>View All URL</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={500} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TwoColumnGrid>

        <SectionStack>
          <SectionHeaderRow>
            <SectionTitle>Select Blog Posts ({selectedIds.length}/{limit})</SectionTitle>
          </SectionHeaderRow>

          <TwoColumnGrid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 14, fontWeight: 500 }}>Search Published Posts</label>
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search by title or slug"
              />
            </div>
          </TwoColumnGrid>

          <TwoColumnGrid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 14, fontWeight: 500 }}>Published Posts</label>
              <select
                value={selectedPostIdToAdd}
                onChange={(e) => setSelectedPostIdToAdd(e.target.value)}
                style={{ width: '100%', minHeight: 36, border: '1px solid #d0d5dd', borderRadius: 8, padding: '8px 10px', fontSize: 14, background: '#ffffff' }}
              >
                <option value="">Select a post…</option>
                {filteredAvailablePosts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title} (/{post.slug})
                  </option>
                ))}
              </select>
              <ErrorText style={{ color: '#667085' }}>
                {filteredAvailablePosts.length} result(s)
              </ErrorText>
            </div>
            <FooterRow style={{ alignItems: 'flex-end' }}>
              <Button type="button" variant="outline" onClick={handleAddPost} disabled={!selectedPostIdToAdd}>
                Add Post
              </Button>
            </FooterRow>
          </TwoColumnGrid>

          <ErrorText style={{ color: '#667085' }}>
            {ux('selected_post_ids').what ?? 'Select and order published posts for Home Trending.'}
          </ErrorText>

          {fields.map((field, index) => {
            const postId = selectedIds[index];
            const post = postById.get(postId);

            return (
              <ItemCard key={field.id}>
                <SectionHeaderRow>
                  <SectionTitle style={{ margin: 0 }}>
                    {post ? post.title : `Missing post: ${postId}`}
                  </SectionTitle>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button type="button" variant="outline" size="sm" onClick={() => move(index, index - 1)} disabled={index === 0}>
                      Up
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>
                      Down
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </div>
                </SectionHeaderRow>
                <ErrorText style={{ color: '#667085' }}>
                  {post
                    ? `/${post.slug}${post.published_at ? ` • ${new Date(post.published_at).toLocaleDateString('vi-VN')}` : ''}`
                    : 'This post is not published or no longer available.'}
                </ErrorText>
              </ItemCard>
            );
          })}

          {form.formState.errors.selected_post_ids && (
            <ErrorText>{form.formState.errors.selected_post_ids.message}</ErrorText>
          )}
        </SectionStack>
      </FormStack>
    </Form>
  );
}
