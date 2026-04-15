'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { CmsPage, CmsPageSection, CmsSharedSection } from '@/lib/cms';
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

interface HomePageEditorProps {
  page: CmsPage;
  sections: CmsPageSection[];
  shared: {
    exclusiveTalents: CmsSharedSection | null;
    contactCta: CmsSharedSection | null;
  };
  role: string;
  canPublish: boolean;
  canManageShared: boolean;
}

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Badge = styled.span<{ $variant: 'local' | 'shared' | 'global' }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 9999px;
  background-color: ${({ $variant }) => {
    switch ($variant) {
      case 'local': return '#e0e7ff';
      case 'shared': return '#fef08a';
      case 'global': return '#fce7f3';
      default: return '#f1f5f9';
    }
  }};
  color: ${({ $variant }) => {
    switch ($variant) {
      case 'local': return '#3730a3';
      case 'shared': return '#854d0e';
      case 'global': return '#9d174d';
      default: return '#0f172a';
    }
  }};
`;

const TopActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 8px;
`;

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
  const findLocal = (schemaKey: string) => sections.find(s => s.schema_key === schemaKey);

  const heroSection = findLocal('home.hero.v1');
  const partnersSection = findLocal('home.partners.v1');
  const coreCompetenciesSection = findLocal('home.core_competencies.v1');
  const efficiencySection = findLocal('home.efficiency.v1');
  const trendingSection = findLocal('home.trending.v1');

  return (
    <EditorContainer>
      <TopActionBar>
        <div>
          <Title>Home Page Editor</Title>
          <SubText>
            {hasUnpublished 
              ? "You have unpublished draft changes." 
              : "All changes are published."}
          </SubText>
          <MetaText>Your role: {role}</MetaText>
          <MetaText>
            Last edited: {page.last_edited_by_identifier ?? 'N/A'} at {formatAuditDate(page.last_edited_at)}
          </MetaText>
          <MetaText>
            Last published: {page.last_published_by_identifier ?? 'N/A'} at {formatAuditDate(page.last_published_at)}
          </MetaText>
        </div>
        <AdminButton
          onClick={handlePublish} 
          disabled={!hasUnpublished || isPending || !canPublish}
          variant={hasUnpublished ? 'default' : 'outline'}
          title={canPublish ? undefined : 'Your role cannot publish.'}
        >
          {isPending ? 'Publishing...' : 'Publish Home'}
        </AdminButton>
      </TopActionBar>

      <AdminAlert>
        <AdminAlertTitle>Shared Sections Ownership</AdminAlertTitle>
        <AdminAlertDescription>
          Exclusive Talents and Contact CTA are now managed in the dedicated Shared Sections module.
          Canonical ownership is under `/admin/content/shared`.
        </AdminAlertDescription>
        {!canManageShared && (
          <MetaText>
            Your role cannot edit shared sections from this page.
          </MetaText>
        )}
        <ButtonRow>
          <AdminButton href="/admin/content/shared" size="sm" variant="outline">
            Open Shared Sections
          </AdminButton>
        </ButtonRow>
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
                  <SectionHeader>Hero <Badge $variant="local">Local</Badge></SectionHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeHeroEditor pageId={page.id} section={heroSection} />
                </AccordionContent>
              </AccordionItem>
            )}
            
            {partnersSection && (
              <AccordionItem value="partners">
                <AccordionTrigger>
                  <SectionHeader>Partners <Badge $variant="local">Local</Badge></SectionHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <HomePartnersEditor pageId={page.id} section={partnersSection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {coreCompetenciesSection && (
              <AccordionItem value="competencies">
                <AccordionTrigger>
                  <SectionHeader>Core Competencies <Badge $variant="local">Local</Badge></SectionHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeCoreCompetenciesEditor pageId={page.id} section={coreCompetenciesSection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {efficiencySection && (
              <AccordionItem value="efficiency">
                <AccordionTrigger>
                  <SectionHeader>Efficiency <Badge $variant="local">Local</Badge></SectionHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeEfficiencyEditor pageId={page.id} section={efficiencySection} />
                </AccordionContent>
              </AccordionItem>
            )}

            {canManageShared && shared.exclusiveTalents ? (
              <AccordionItem value="talents">
                <AccordionTrigger>
                  <SectionHeader>Exclusive Talents <Badge $variant="shared">Shared</Badge></SectionHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <SharedExclusiveTalentsEditor section={shared.exclusiveTalents} />
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {canManageShared && shared.contactCta ? (
              <AccordionItem value="contactCta">
                <AccordionTrigger>
                  <SectionHeader>Contact CTA <Badge $variant="shared">Shared</Badge></SectionHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <SharedContactCtaEditor section={shared.contactCta} />
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {trendingSection && (
              <AccordionItem value="trending">
                <AccordionTrigger>
                  <SectionHeader>Trending <Badge $variant="local">Local</Badge></SectionHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <HomeTrendingEditor pageId={page.id} section={trendingSection} />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </AdminCardContent>
      </AdminCard>
    </EditorContainer>
  );
}

const Title = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
`;

const SubText = styled.p`
  margin: 4px 0 0;
  font-size: 0.875rem;
  color: #64748b;
`;

const MetaText = styled.p`
  margin: 4px 0 0;
  font-size: 0.75rem;
  color: #64748b;
`;

const ButtonRow = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;
