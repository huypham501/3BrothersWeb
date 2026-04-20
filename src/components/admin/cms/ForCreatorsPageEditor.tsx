'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
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
  AdminBadge,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
  AdminCardTitle,
} from '@/components/admin/layout/AdminPrimitives';
import { CmsEditorStatusBar } from './CmsEditorStatusBar';
import { CmsDependenciesCard } from './CmsDependenciesCard';
import type { CmsDependency } from './CmsDependenciesCard';
import { HomePageSettingsEditor } from './editors/HomePageSettingsEditor';
import { ForCreatorsHeroEditor } from './editors/ForCreatorsHeroEditor';
import { ForCreatorsBenefitEditor } from './editors/ForCreatorsBenefitEditor';
import { ForCreatorsTestimonialsEditor } from './editors/ForCreatorsTestimonialsEditor';
import { ForCreatorsCtaEditor } from './editors/ForCreatorsCtaEditor';

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

  const hasUnpublished =
    page.has_unpublished_changes || sections.some((s) => s.has_unpublished_changes);

  const handlePublish = () => {
    startTransition(async () => {
      try {
        await publishForCreatorsPage(page.id);
        alert('Da publish For Creators thanh cong!');
        router.refresh();
      } catch (err) {
        alert('Publish that bai. Vui long thu lai.');
        console.error(err);
      }
    });
  };

  const findLocal = <T,>(schemaKey: string) =>
    sections.find((s) => s.schema_key === schemaKey) as CmsPageSection<T> | undefined;

  const heroSection = findLocal<z.infer<typeof forCreatorsHeroSchema>>('for_creators.hero.v1');
  const benefitSection = findLocal<z.infer<typeof forCreatorsBenefitSchema>>('for_creators.benefit.v1');
  const testimonialsSection = findLocal<z.infer<typeof forCreatorsTestimonialsSchema>>('for_creators.testimonials.v1');
  const ctaSection = findLocal<z.infer<typeof forCreatorsCtaSchema>>('for_creators.cta.v1');

  const dependencies: CmsDependency[] = [
    { label: 'Header', connected: !!globals.header, kind: 'global', editHref: '/admin/content/settings/header' },
    { label: 'Footer', connected: !!globals.footer, kind: 'global', editHref: '/admin/content/settings/footer' },
    { label: 'Exclusive Talents', connected: !!shared.exclusiveTalents, kind: 'shared', editHref: '/admin/content/shared/exclusive-talents' },
    { label: 'Contact CTA', connected: !!shared.contactCta, kind: 'shared', editHref: '/admin/content/shared/contact-cta' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CmsEditorStatusBar
        pageTitle="For Creators CMS"
        hasUnpublished={hasUnpublished}
        lastEditedBy={page.last_edited_by_identifier}
        lastEditedAt={page.last_edited_at}
        lastPublishedBy={page.last_published_by_identifier}
        lastPublishedAt={page.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPending}
        onPublish={handlePublish}
        publishLabel="Publish For Creators"
      />

      <AdminCard>
        <AdminCardHeader><AdminCardTitle>Page Settings</AdminCardTitle></AdminCardHeader>
        <AdminCardContent>
          <HomePageSettingsEditor page={page} />
        </AdminCardContent>
      </AdminCard>

      <AdminCard>
        <AdminCardHeader><AdminCardTitle>Section Editors</AdminCardTitle></AdminCardHeader>
        <AdminCardContent>
          <Accordion collapsible>
            {heroSection && (
              <AccordionItem value="hero">
                <AccordionTrigger><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Hero <AdminBadge tone="info">Local</AdminBadge></span></AccordionTrigger>
                <AccordionContent><ForCreatorsHeroEditor pageId={page.id} section={heroSection} /></AccordionContent>
              </AccordionItem>
            )}
            {benefitSection && (
              <AccordionItem value="benefit">
                <AccordionTrigger><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Benefit <AdminBadge tone="info">Local</AdminBadge></span></AccordionTrigger>
                <AccordionContent><ForCreatorsBenefitEditor pageId={page.id} section={benefitSection} /></AccordionContent>
              </AccordionItem>
            )}
            {testimonialsSection && (
              <AccordionItem value="testimonials">
                <AccordionTrigger><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Testimonials <AdminBadge tone="info">Local</AdminBadge></span></AccordionTrigger>
                <AccordionContent><ForCreatorsTestimonialsEditor pageId={page.id} section={testimonialsSection} /></AccordionContent>
              </AccordionItem>
            )}
            {ctaSection && (
              <AccordionItem value="cta">
                <AccordionTrigger><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>CTA Banner <AdminBadge tone="info">Local</AdminBadge></span></AccordionTrigger>
                <AccordionContent><ForCreatorsCtaEditor pageId={page.id} section={ctaSection} /></AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </AdminCardContent>
      </AdminCard>

      <CmsDependenciesCard dependencies={dependencies} />
    </div>
  );
}
