'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { CmsPage, CmsPageSection, CmsSharedSection, CmsGlobalSetting } from '@/lib/cms';
import { publishForCreatorsPage } from '@/lib/cms/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/admin/controls/AdminAccordion';
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
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

interface ForCreatorsPageEditorProps {
  page: CmsPage;
  sections: CmsPageSection[];
  globals: {
    header: CmsGlobalSetting | null;
    footer: CmsGlobalSetting | null;
  };
  shared: {
    exclusiveTalents: CmsSharedSection | null;
    contactCta: CmsSharedSection | null;
  };
  role: string;
  canPublish: boolean;
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
  const findLocal = (schemaKey: string) => sections.find((s) => s.schema_key === schemaKey);

  const heroSection = findLocal('for_creators.hero.v1');
  const benefitSection = findLocal('for_creators.benefit.v1');
  const testimonialsSection = findLocal('for_creators.testimonials.v1');
  const ctaSection = findLocal('for_creators.cta.v1');

  return (
    <EditorContainer>
      <TopActionBar>
        <div>
          <Title>For Creators Editor</Title>
          <SubText>
            {hasUnpublished ? 'You have unpublished draft changes.' : 'All changes are published.'}
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
          {isPending ? 'Publishing...' : 'Publish For Creators'}
        </AdminButton>
      </TopActionBar>

      <AdminAlert>
        <AdminAlertTitle>Shared/Global Ownership</AdminAlertTitle>
        <AdminAlertDescription>
          Header/Footer are managed in Global Settings, and Exclusive Talents/Contact CTA are managed in Shared Sections.
        </AdminAlertDescription>
        <ButtonRow>
          <AdminButton href="/admin/content/settings" size="sm" variant="outline">Open Global Settings</AdminButton>
          <AdminButton href="/admin/content/shared" size="sm" variant="outline">Open Shared Sections</AdminButton>
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
          <AdminCardTitle>Local Section Editors</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent>
          <Accordion collapsible>
            {heroSection && (
              <AccordionItem value="hero">
                <AccordionTrigger><SectionHeader>Hero <Badge $variant="local">Local</Badge></SectionHeader></AccordionTrigger>
                <AccordionContent><ForCreatorsHeroEditor pageId={page.id} section={heroSection} /></AccordionContent>
              </AccordionItem>
            )}

            {benefitSection && (
              <AccordionItem value="benefit">
                <AccordionTrigger><SectionHeader>Benefit <Badge $variant="local">Local</Badge></SectionHeader></AccordionTrigger>
                <AccordionContent><ForCreatorsBenefitEditor pageId={page.id} section={benefitSection} /></AccordionContent>
              </AccordionItem>
            )}

            {testimonialsSection && (
              <AccordionItem value="testimonials">
                <AccordionTrigger><SectionHeader>Testimonials <Badge $variant="local">Local</Badge></SectionHeader></AccordionTrigger>
                <AccordionContent><ForCreatorsTestimonialsEditor pageId={page.id} section={testimonialsSection} /></AccordionContent>
              </AccordionItem>
            )}

            {ctaSection && (
              <AccordionItem value="cta">
                <AccordionTrigger><SectionHeader>CTA Banner <Badge $variant="local">Local</Badge></SectionHeader></AccordionTrigger>
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
          <DependencyList>
            <DependencyText><strong>Global:</strong> {globals.header ? 'Header connected' : 'Header missing'} / {globals.footer ? 'Footer connected' : 'Footer missing'}</DependencyText>
            <DependencyText><strong>Shared:</strong> {shared.exclusiveTalents ? 'Exclusive Talents connected' : 'Exclusive Talents missing'} / {shared.contactCta ? 'Contact CTA connected' : 'Contact CTA missing'}</DependencyText>
          </DependencyList>
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

const DependencyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DependencyText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #334155;
`;
