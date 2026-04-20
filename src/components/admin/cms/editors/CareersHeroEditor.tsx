'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button, Divider, Typography } from 'antd';
import { careersHeroSchema } from '@/lib/cms/schemas';
import type { CmsPageSection } from '@/lib/cms';
import type { CareersHeroPayload } from '@/lib/cms/types/payloads';
import { saveCareersHeroDraft, publishCareersPage } from '@/lib/cms/careers-actions';
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
  SectionStack,
  SectionTitle,
  TwoColumnGrid,
} from './EditorLayout';
import { CmsEditorStatusBar } from '@/components/admin/cms/CmsEditorStatusBar';

type FormValues = z.infer<typeof careersHeroSchema>;

const PERK_LABELS: Record<string, string> = {
  grow: 'Perk — Phát triển nhanh',
  team: 'Perk — Đội ngũ trẻ trung',
  creative: 'Perk — Sáng tạo',
};

interface CareersHeroEditorProps {
  /** The careers page ID (from pages table). */
  pageId: string;
  /** The page section row (careers.hero.v1). */
  section: CmsPageSection<CareersHeroPayload>;
  role: string;
  canPublish: boolean;
}

export function CareersHeroEditor({
  pageId,
  section,
  role,
  canPublish,
}: CareersHeroEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(careersHeroSchema),
    defaultValues: section.content ?? {
      superlabel: '',
      title: '',
      subtitle: '',
      perks: [
        { id: 'grow', icon: 'grow', title: '', description: '' },
        { id: 'team', icon: 'team', title: '', description: '' },
        { id: 'creative', icon: 'creative', title: '', description: '' },
      ],
    },
  });

  const onSaveDraft = (data: FormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        await saveCareersHeroDraft(pageId, data as CareersHeroPayload);
        setSuccessMsg('Draft saved.');
        router.refresh();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to save draft.');
      }
    });
  };

  const onPublish = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        await publishCareersPage(pageId);
        setSuccessMsg('Page published successfully.');
        router.refresh();
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to publish.');
      }
    });
  };

  return (
    <Form {...form}>
      <FormStack onSubmit={form.handleSubmit(onSaveDraft)}>
        {/* Status bar */}
        <CmsEditorStatusBar
          pageTitle="Careers Hero Section"
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

        {/* Heading fields */}
        <SectionStack>
          <SectionTitle>Hero Heading</SectionTitle>

          <FormField
            control={form.control}
            name="superlabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Superlabel (uppercase label above title)</FormLabel>
                <FormControl>
                  <Input placeholder="Gia nhập đội ngũ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Title</FormLabel>
                <FormControl>
                  <Input placeholder="3Brothers Media" {...field} />
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
                  <Textarea rows={3} placeholder="Chúng tôi đang tìm kiếm..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionStack>

        <Divider />

        {/* Perks — 3 fixed cards */}
        <SectionStack>
          <SectionTitle>Perk Cards (3 fixed)</SectionTitle>
          {([0, 1, 2] as const).map((idx) => {
            const perkId = form.watch(`perks.${idx}.id`);
            return (
              <ItemCard key={idx}>
                <Typography.Text strong style={{ fontSize: 13 }}>
                  {PERK_LABELS[perkId] ?? `Perk ${idx + 1}`}
                </Typography.Text>
                <TwoColumnGrid>
                  <FormField
                    control={form.control}
                    name={`perks.${idx}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Phát triển nhanh" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TwoColumnGrid>
                <FormField
                  control={form.control}
                  name={`perks.${idx}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={2} placeholder="Mô tả ngắn về perk này..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ItemCard>
            );
          })}
        </SectionStack>

        <Divider />

        {/* Footer actions */}
        <FooterRow>
          <Button
            htmlType="submit"
            loading={isPending}
            style={{ minWidth: 120 }}
          >
            Save Draft
          </Button>
        </FooterRow>
      </FormStack>
    </Form>
  );
}
