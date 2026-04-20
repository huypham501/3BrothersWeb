'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  CmsPage,
  CmsPageSection,
  CmsSharedSection,
  homeCoreCompetenciesSchema,
  homeEfficiencySchema,
  homeHeroSchema,
  homePartnersSchema,
  homeTrendingSchema,
  sharedContactCtaSchema,
  sharedExclusiveTalentsSchema,
} from '@/lib/cms';
import { publishHomePage } from '@/lib/cms/actions';
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
import { HomeHeroEditor } from './editors/HomeHeroEditor';
import { HomePartnersEditor } from './editors/HomePartnersEditor';
import { HomeCoreCompetenciesEditor } from './editors/HomeCoreCompetenciesEditor';
import { HomeEfficiencyEditor } from './editors/HomeEfficiencyEditor';
import { HomeTrendingEditor } from './editors/HomeTrendingEditor';
import { SharedExclusiveTalentsEditor } from './editors/SharedExclusiveTalentsEditor';
import { SharedContactCtaEditor } from './editors/SharedContactCtaEditor';
import { z } from 'zod';

interface HomePageEditorProps {
  page: CmsPage;
  sections: CmsPageSection[];
  shared: {
    exclusiveTalents: CmsSharedSection<z.infer<typeof sharedExclusiveTalentsSchema>> | null;
    contactCta: CmsSharedSection<z.infer<typeof sharedContactCtaSchema>> | null;
  };
  role: string;
  canPublish: boolean;
  canManageShared: boolean;
}

export function HomePageEditor({
  page,
  sections,
  shared,
  role,
  canPublish,
  canManageShared,
}: HomePageEditorProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePublish = () => {
    startTransition(async () => {
      try {
        await publishHomePage(page.id);
        alert('Successfully published Home Page content!');
        router.refresh();
      } catch (err) {
        alert('Failed to publish Home Page content. Please try again.');
        console.error(err);
      }
    });
  };

  const hasUnpublished = page.has_unpublished_changes 
    || sections.some(s => s.has_unpublished_changes);
  
  // Helper to find local section
  const findLocal = <T,>(schemaKey: string) => sections.find((s) => s.schema_key === schemaKey) as CmsPageSection<T> | undefined;

  const heroSection = findLocal<z.infer<typeof homeHeroSchema>>('home.hero.v1');
  const partnersSection = findLocal<z.infer<typeof homePartnersSchema>>('home.partners.v1');
  const coreCompetenciesSection = findLocal<z.infer<typeof homeCoreCompetenciesSchema>>('home.core_competencies.v1');
  const efficiencySection = findLocal<z.infer<typeof homeEfficiencySchema>>('home.efficiency.v1');
  const trendingSection = findLocal<z.infer<typeof homeTrendingSchema>>('home.trending.v1');

  // ── Dependencies config ─────────────────────────────────────────────────────
  const dependencies: CmsDependency[] = [
    {
      label: 'Header',
      connected: true, // global settings always assumed present; warning shown if editor is missing
      kind: 'global',
      editHref: '/admin/content/settings/header',
    },
    {
      label: 'Footer',
      connected: true,
      kind: 'global',
      editHref: '/admin/content/settings/footer',
    },
    {
      label: 'Exclusive Talents',
      connected: !!shared.exclusiveTalents,
      kind: 'shared',
      editHref: '/admin/content/shared/exclusive-talents',
    },
    {
      label: 'Contact CTA',
      connected: !!shared.contactCta,
      kind: 'shared',
      editHref: '/admin/content/shared/contact-cta',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Status bar ── */}
      <CmsEditorStatusBar
        pageTitle="Home CMS"
        hasUnpublished={hasUnpublished}
        lastEditedBy={page.last_edited_by_identifier}
        lastEditedAt={page.last_edited_at}
        lastPublishedBy={page.last_published_by_identifier}
        lastPublishedAt={page.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPending}
        onPublish={handlePublish}
        publishLabel="Publish Home"
      />

      {/* ── Page settings ── */}
      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Page Settings</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent>
          <HomePageSettingsEditor page={page} />
        </AdminCardContent>
      </AdminCard>

      {/* ── Section editors ── */}
      <AdminCard>
        <AdminCardHeader>
          <AdminCardTitle>Section Editors</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent>
          <Accordion collapsible>
            {heroSection && (
              <AccordionItem value="hero">
                <AccordionTrigger>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Hero <AdminBadge tone="info">Local</AdminBadge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeHeroEditor pageId={page.id} section={heroSection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {partnersSection && (
              <AccordionItem value="partners">
                <AccordionTrigger>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Partners <AdminBadge tone="info">Local</AdminBadge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <HomePartnersEditor pageId={page.id} section={partnersSection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {coreCompetenciesSection && (
              <AccordionItem value="competencies">
                <AccordionTrigger>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Core Competencies <AdminBadge tone="info">Local</AdminBadge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeCoreCompetenciesEditor pageId={page.id} section={coreCompetenciesSection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {efficiencySection && (
              <AccordionItem value="efficiency">
                <AccordionTrigger>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Efficiency <AdminBadge tone="info">Local</AdminBadge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeEfficiencyEditor pageId={page.id} section={efficiencySection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {canManageShared && shared.exclusiveTalents && (
              <AccordionItem value="talents">
                <AccordionTrigger>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Exclusive Talents <AdminBadge tone="warning">Shared</AdminBadge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <SharedExclusiveTalentsEditor section={shared.exclusiveTalents} />
                </AccordionContent>
              </AccordionItem>
            )}

            {canManageShared && shared.contactCta && (
              <AccordionItem value="contactCta">
                <AccordionTrigger>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Contact CTA <AdminBadge tone="warning">Shared</AdminBadge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <SharedContactCtaEditor section={shared.contactCta} />
                </AccordionContent>
              </AccordionItem>
            )}

            {trendingSection && (
              <AccordionItem value="trending">
                <AccordionTrigger>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Trending <AdminBadge tone="info">Local</AdminBadge>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeTrendingEditor pageId={page.id} section={trendingSection} />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </AdminCardContent>
      </AdminCard>

      {/* ── Dependencies ── */}
      <CmsDependenciesCard dependencies={dependencies} />
    </div>
  );
}
