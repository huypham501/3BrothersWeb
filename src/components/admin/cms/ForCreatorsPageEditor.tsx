'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  CmsPage,
  CmsPageSection,
  CmsSharedSection,
  CmsGlobalSetting,
  forCreatorsBenefitSchema,
  forCreatorsCtaSchema,
  forCreatorsHeroSchema,
  forCreatorsTestimonialsSchema,
  globalFooterSchema,
  globalHeaderSchema,
  sharedContactCtaSchema,
  sharedExclusiveTalentsSchema,
} from '@/lib/cms';
import { publishForCreatorsPage } from '@/lib/cms/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/admin/controls/AdminAccordion';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
  AdminCardTitle,
} from '@/components/admin/layout/AdminPrimitives';
import { HomePageSettingsEditor } from './editors/HomePageSettingsEditor';
import { ForCreatorsHeroEditor } from './editors/ForCreatorsHeroEditor';
import { ForCreatorsBenefitEditor } from './editors/ForCreatorsBenefitEditor';
import { ForCreatorsTestimonialsEditor } from './editors/ForCreatorsTestimonialsEditor';
import { ForCreatorsCtaEditor } from './editors/ForCreatorsCtaEditor';
import { z } from 'zod';

interface ForCreatorsPageEditorProps {
  page: CmsPage;
  sections: CmsPageSection[];
  globals: {
    header: CmsGlobalSetting<z.infer<typeof globalHeaderSchema>> | null;
    footer: CmsGlobalSetting<z.infer<typeof globalFooterSchema>> | null;
  };
  shared: {
    exclusiveTalents: CmsSharedSection<z.infer<typeof sharedExclusiveTalentsSchema>> | null;
    contactCta: CmsSharedSection<z.infer<typeof sharedContactCtaSchema>> | null;
  };
  role: string;
  canPublish: boolean;
}

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export function ForCreatorsPageEditor({
  page,
  sections,
  globals,
  shared,
  role,
  canPublish,
}: ForCreatorsPageEditorProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePublish = () => {
    startTransition(async () => {
      try {
        await publishForCreatorsPage(page.id);
        alert('Successfully published For Creators content!');
        router.refresh();
      } catch (err) {
        alert('Failed to publish For Creators content. Please try again.');
        console.error(err);
      }
    });
  };

  const hasUnpublished = page.has_unpublished_changes || sections.some((s) => s.has_unpublished_changes);
  const findLocal = <T,>(schemaKey: string) => sections.find((s) => s.schema_key === schemaKey) as CmsPageSection<T> | undefined;

  const heroSection = findLocal<z.infer<typeof forCreatorsHeroSchema>>('for_creators.hero.v1');
  const benefitSection = findLocal<z.infer<typeof forCreatorsBenefitSchema>>('for_creators.benefit.v1');
  const testimonialsSection = findLocal<z.infer<typeof forCreatorsTestimonialsSchema>>('for_creators.testimonials.v1');
  const ctaSection = findLocal<z.infer<typeof forCreatorsCtaSchema>>('for_creators.cta.v1');

  return (
    <div>
      <div>
        <div>
          <h2>For Creators Editor</h2>
          <p>
            {hasUnpublished ? 'You have unpublished draft changes.' : 'All changes are published.'}
          </p>
          <p>Your role: {role}</p>
          <p>
            Last edited: {page.last_edited_by_identifier ?? 'N/A'} at {formatAuditDate(page.last_edited_at)}
          </p>
          <p>
            Last published: {page.last_published_by_identifier ?? 'N/A'} at {formatAuditDate(page.last_published_at)}
          </p>
        </div>
        <AdminButton
          onClick={handlePublish}
          disabled={!hasUnpublished || isPending || !canPublish}
          variant={hasUnpublished ? 'default' : 'outline'}
          title={canPublish ? undefined : 'Your role cannot publish.'}
        >
          {isPending ? 'Publishing...' : 'Publish For Creators'}
        </AdminButton>
      </div>

      <AdminAlert>
        <AdminAlertTitle>Shared/Global Ownership</AdminAlertTitle>
        <AdminAlertDescription>
          Header/Footer are managed in Global Settings, and Exclusive Talents/Contact CTA are managed in Shared Sections.
        </AdminAlertDescription>
        <div>
          <AdminButton href="/admin/content/settings" size="sm" variant="outline">Open Global Settings</AdminButton>
          <AdminButton href="/admin/content/shared" size="sm" variant="outline">Open Shared Sections</AdminButton>
        </div>
      </AdminAlert>

      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Page Settings</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent>
          <HomePageSettingsEditor page={page} />
        </AdminCardContent>
      </AdminCard>

      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Local Section Editors</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent>
          <Accordion collapsible>
            {heroSection && (
              <AccordionItem value="hero">
                <AccordionTrigger><div>Hero <AdminBadge tone="info">Local</AdminBadge></div></AccordionTrigger>
                <AccordionContent><ForCreatorsHeroEditor pageId={page.id} section={heroSection} /></AccordionContent>
              </AccordionItem>
            )}

            {benefitSection && (
              <AccordionItem value="benefit">
                <AccordionTrigger><div>Benefit <AdminBadge tone="info">Local</AdminBadge></div></AccordionTrigger>
                <AccordionContent><ForCreatorsBenefitEditor pageId={page.id} section={benefitSection} /></AccordionContent>
              </AccordionItem>
            )}

            {testimonialsSection && (
              <AccordionItem value="testimonials">
                <AccordionTrigger><div>Testimonials <AdminBadge tone="info">Local</AdminBadge></div></AccordionTrigger>
                <AccordionContent><ForCreatorsTestimonialsEditor pageId={page.id} section={testimonialsSection} /></AccordionContent>
              </AccordionItem>
            )}

            {ctaSection && (
              <AccordionItem value="cta">
                <AccordionTrigger><div>CTA Banner <AdminBadge tone="info">Local</AdminBadge></div></AccordionTrigger>
                <AccordionContent><ForCreatorsCtaEditor pageId={page.id} section={ctaSection} /></AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </AdminCardContent>
      </AdminCard>

      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Dependencies</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent>
          <div>
            <p><strong>Global:</strong> {globals.header ? 'Header connected' : 'Header missing'} / {globals.footer ? 'Footer connected' : 'Footer missing'}</p>
            <p><strong>Shared:</strong> {shared.exclusiveTalents ? 'Exclusive Talents connected' : 'Exclusive Talents missing'} / {shared.contactCta ? 'Contact CTA connected' : 'Contact CTA missing'}</p>
          </div>
        </AdminCardContent>
      </AdminCard>
    </div>
  );
}
