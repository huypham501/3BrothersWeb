'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button, Divider, Switch, Typography } from 'antd';
import { careersSocialShareSchema } from '@/lib/cms/schemas';
import type { CmsPageSection } from '@/lib/cms';
import type { CareersSocialSharePayload } from '@/lib/cms/types/payloads';
import { saveCareersSocialShareDraft, publishCareersPage } from '@/lib/cms/careers-actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/admin/controls/AdminForm';
import { AdminInput as Input } from '@/components/admin/controls/AdminInput';
import {
  CmsActionFeedback,
  useCmsActionFeedback,
} from '@/components/admin/cms/CmsActionFeedback';
import {
  FooterRow,
  FormStack,
  ItemCard,
  SectionStack,
  SectionTitle,
  ToggleFormItem,
  TwoColumnGrid,
} from './EditorLayout';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';

type FormValues = z.infer<typeof careersSocialShareSchema>;

const DEFAULT_SOCIAL_SHARE: CareersSocialSharePayload = {
  enabled: true,
  share_label: 'Chia sẻ vị trí này',
  platforms: [
    {
      id: 'facebook',
      label: 'Facebook',
      enabled: true,
      url_template: 'https://www.facebook.com/sharer/sharer.php?u={url}',
    },
    {
      id: 'twitter',
      label: 'Twitter',
      enabled: true,
      url_template: 'https://twitter.com/intent/tweet?url={url}&text={title}',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      enabled: true,
      url_template: '',
    },
  ],
};

const PLATFORM_LABELS: Record<CareersSocialSharePayload['platforms'][number]['id'], string> = {
  facebook: 'Facebook',
  twitter: 'Twitter',
  instagram: 'Instagram',
};

interface CareersSocialShareEditorProps {
  pageId: string;
  section: CmsPageSection<CareersSocialSharePayload>;
  role: string;
  canPublish: boolean;
}

export function CareersSocialShareEditor({
  pageId,
  section,
  role,
  canPublish,
}: CareersSocialShareEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { feedback, showSuccess, showError, clearFeedback } = useCmsActionFeedback();

  const form = useForm<FormValues>({
    resolver: zodResolver(careersSocialShareSchema),
    defaultValues: section.content ?? DEFAULT_SOCIAL_SHARE,
  });

  const onSaveDraft = (data: FormValues) => {
    clearFeedback();
    startTransition(async () => {
      try {
        await saveCareersSocialShareDraft(pageId, data as CareersSocialSharePayload);
        showSuccess('Draft saved. Changes are not live until publish.');
        router.refresh();
      } catch (err) {
        showError(err, 'Failed to save draft.');
      }
    });
  };

  const onPublish = () => {
    clearFeedback();
    startTransition(async () => {
      try {
        await publishCareersPage(pageId);
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
        <CmsEditorStatusBar
          pageTitle="Careers Social Share"
          hasUnpublished={section.has_unpublished_changes ?? false}
          lastEditedBy={section.last_edited_by_identifier ?? null}
          lastEditedAt={section.last_edited_at ?? null}
          lastPublishedBy={section.last_published_by_identifier ?? null}
          lastPublishedAt={section.last_published_at ?? null}
          role={role}
          canPublish={canPublish}
          isPublishing={isPending}
          onPublish={onPublish}
          publishLabel="Publish Page"
        />

        <CmsActionFeedback feedback={feedback} />

        <SectionStack>
          <SectionTitle>Share Section</SectionTitle>
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <ToggleFormItem>
                <FormLabel>Show social share block</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </ToggleFormItem>
            )}
          />

          <FormField
            control={form.control}
            name="share_label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Label</FormLabel>
                <FormControl>
                  <Input placeholder="Chia sẻ vị trí này" {...field} maxLength={80} showCount />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionStack>

        <Divider />

        <SectionStack>
          <SectionTitle>Platforms</SectionTitle>
          <Typography.Text type="secondary">
            Use {'{url}'} and {'{title}'} in URL templates. Leave Instagram empty if no share URL is needed.
          </Typography.Text>

          {form.watch('platforms').map((platform, idx) => (
            <ItemCard key={platform.id}>
              <Typography.Text strong>{PLATFORM_LABELS[platform.id]}</Typography.Text>
              <TwoColumnGrid>
                <FormField
                  control={form.control}
                  name={`platforms.${idx}.enabled`}
                  render={({ field }) => (
                    <ToggleFormItem>
                      <FormLabel>Enabled</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </ToggleFormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`platforms.${idx}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accessible Label</FormLabel>
                      <FormControl>
                        <Input placeholder={PLATFORM_LABELS[platform.id]} {...field} maxLength={40} showCount />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TwoColumnGrid>

              <FormField
                control={form.control}
                name={`platforms.${idx}.url_template`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Template</FormLabel>
                    <FormControl>
                      <Input placeholder="https://...{url}" {...field} maxLength={500} showCount />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ItemCard>
          ))}
        </SectionStack>

        <Divider />

        <FooterRow>
          <Button htmlType="submit" loading={isPending} style={{ minWidth: 120 }}>
            Save Draft
          </Button>
        </FooterRow>
      </FormStack>
    </Form>
  );
}
