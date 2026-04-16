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

function formatAuditDate(value?: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
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

  return (
    <div>
      <div>
        <div>
          <h2>Home Page Editor</h2>
          <p>
            {hasUnpublished 
              ? "You have unpublished draft changes." 
              : "All changes are published."}
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
          {isPending ? 'Publishing...' : 'Publish Home'}
        </AdminButton>
      </div>

      <AdminAlert>
        <AdminAlertTitle>Shared Sections Ownership</AdminAlertTitle>
        <AdminAlertDescription>
          Exclusive Talents and Contact CTA are now managed in the dedicated Shared Sections module.
          Canonical ownership is under `/admin/content/shared`.
        </AdminAlertDescription>
        {!canManageShared && (
          <p>
            Your role cannot edit shared sections from this page.
          </p>
        )}
        <div>
          <AdminButton href="/admin/content/shared" size="sm" variant="outline">
            Open Shared Sections
          </AdminButton>
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
          <AdminCardTitle>Section Editors</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent>
          <Accordion collapsible>
            {heroSection && (
              <AccordionItem value="hero">
                <AccordionTrigger>
                  <div>Hero <AdminBadge tone="info">Local</AdminBadge></div>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeHeroEditor pageId={page.id} section={heroSection} />
                </AccordionContent>
              </AccordionItem>
            )}
            
            {partnersSection && (
              <AccordionItem value="partners">
                <AccordionTrigger>
                  <div>Partners <AdminBadge tone="info">Local</AdminBadge></div>
                </AccordionTrigger>
                <AccordionContent>
                  <HomePartnersEditor pageId={page.id} section={partnersSection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {coreCompetenciesSection && (
              <AccordionItem value="competencies">
                <AccordionTrigger>
                  <div>Core Competencies <AdminBadge tone="info">Local</AdminBadge></div>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeCoreCompetenciesEditor pageId={page.id} section={coreCompetenciesSection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {efficiencySection && (
              <AccordionItem value="efficiency">
                <AccordionTrigger>
                  <div>Efficiency <AdminBadge tone="info">Local</AdminBadge></div>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeEfficiencyEditor pageId={page.id} section={efficiencySection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {canManageShared && shared.exclusiveTalents ? (
              <AccordionItem value="talents">
                <AccordionTrigger>
                  <div>Exclusive Talents <AdminBadge tone="warning">Shared</AdminBadge></div>
                </AccordionTrigger>
                <AccordionContent>
                  <SharedExclusiveTalentsEditor section={shared.exclusiveTalents} />
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {canManageShared && shared.contactCta ? (
              <AccordionItem value="contactCta">
                <AccordionTrigger>
                  <div>Contact CTA <AdminBadge tone="warning">Shared</AdminBadge></div>
                </AccordionTrigger>
                <AccordionContent>
                  <SharedContactCtaEditor section={shared.contactCta} />
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {trendingSection && (
              <AccordionItem value="trending">
                <AccordionTrigger>
                  <div>Trending <AdminBadge tone="info">Local</AdminBadge></div>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeTrendingEditor pageId={page.id} section={trendingSection} />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </AdminCardContent>
      </AdminCard>
    </div>
  );
}
