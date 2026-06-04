'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  CmsPage,
  CmsPageSection,
  CmsGlobalSetting,
  globalFooterSchema,
  globalHeaderSchema,
  socialCommerceGrowthSchema,
  socialCommerceHeroSchema,
  socialCommerceSocialProofSchema,
  socialCommerceValuePropositionSchema,
} from '@/lib/cms';
import { publishSocialCommercePage } from '@/lib/cms/actions';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/admin/controls/AdminAccordion';
import {
  AdminBadge,
  AdminCard,
  AdminCardContent,
  AdminCardHeader,
  AdminCardTitle,
} from '@/components/admin/layout/AdminPrimitives';
import { CmsEditorStatusBar } from './CmsEditorStatusBar';
import { CmsActionFeedback, useCmsActionFeedback } from './CmsActionFeedback';
import { CmsDependenciesCard } from './CmsDependenciesCard';
import type { CmsDependency } from './CmsDependenciesCard';
import { HomePageSettingsEditor } from './editors/HomePageSettingsEditor';
import { SocialCommerceGrowthEditor } from './editors/SocialCommerceGrowthEditor';
import { SocialCommerceHeroEditor } from './editors/SocialCommerceHeroEditor';
import { SocialCommerceSocialProofEditor } from './editors/SocialCommerceSocialProofEditor';
import { SocialCommerceValuePropositionEditor } from './editors/SocialCommerceValuePropositionEditor';

interface SocialCommercePageEditorProps {
  page: CmsPage;
  sections: CmsPageSection[];
  globals: {
    header: CmsGlobalSetting<z.infer<typeof globalHeaderSchema>> | null;
    footer: CmsGlobalSetting<z.infer<typeof globalFooterSchema>> | null;
  };
  role: string;
  canPublish: boolean;
}

export function SocialCommercePageEditor({ page, sections, globals, role, canPublish }: SocialCommercePageEditorProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { feedback, showSuccess, showError } = useCmsActionFeedback();

  const handlePublish = () => {
    startTransition(async () => {
      try {
        await publishSocialCommercePage(page.id);
        showSuccess('Published successfully.');
        router.refresh();
      } catch (err) {
        showError(err, 'Failed to publish. Please try again.');
        console.error(err);
      }
    });
  };

  const hasUnpublished = page.has_unpublished_changes || sections.some((s) => s.has_unpublished_changes);

  const findLocal = <T,>(schemaKey: string) => sections.find((s) => s.schema_key === schemaKey) as CmsPageSection<T> | undefined;
  const ensureSection = <T,>(schemaKey: string, fallbackContent: T): CmsPageSection<T> =>
    findLocal<T>(schemaKey) ?? {
      id: `virtual-${schemaKey}`,
      page_id: page.id,
      schema_key: schemaKey,
      section_key: schemaKey,
      sort_order: 0,
      enabled: true,
      content: fallbackContent,
      created_at: '',
      updated_at: '',
    };

  const heroSection = ensureSection<z.infer<typeof socialCommerceHeroSchema>>(SCHEMA_KEYS.SOCIAL_COMMERCE_HERO, {
    eyebrow: '',
    title: '',
    subtitle: '',
    services: [
      { id: 'live_commerce', label: 'Live Commerce' },
      { id: 'affiliate_marketing', label: 'Affiliate Marketing' },
      { id: 'kol_marketplace', label: 'KOL Marketplace' },
      { id: 'bio_link', label: 'Bio Link' },
      { id: 'brand_partnerships', label: 'Brand Partnerships' },
    ],
  });
  const growthSection = ensureSection<z.infer<typeof socialCommerceGrowthSchema>>(SCHEMA_KEYS.SOCIAL_COMMERCE_GROWTH, {
    heading: '',
    description: '',
    cta_label: '',
    cta_url: '#',
    stats: [
      { id: 'services', title: '5 Dịch vụ', description: '' },
      { id: 'creators_kols', title: '5,000+ Creators & KOLs', description: '' },
      { id: 'brands', title: '150+ Brands', description: '' },
    ],
  });
  const socialProofSection = ensureSection<z.infer<typeof socialCommerceSocialProofSchema>>(SCHEMA_KEYS.SOCIAL_COMMERCE_SOCIAL_PROOF, {
    section_title: '',
    section_subtitle: '',
    items: [
      { id: 'live_commerce', title: 'Live Commerce', description: '' },
      { id: 'affiliate_marketing', title: 'Affiliate Marketing', description: '' },
      { id: 'kol_marketplace', title: 'KOL Marketplace', description: '' },
      { id: 'bio_link', title: 'Bio Link', description: '' },
      { id: 'brand_partnerships', title: 'Brand Partnerships', description: '' },
    ],
  });
  const valuePropositionSection = ensureSection<z.infer<typeof socialCommerceValuePropositionSchema>>(SCHEMA_KEYS.SOCIAL_COMMERCE_VALUE_PROPOSITION, {
    section_title: '',
    section_subtitle: '',
    items: [
      { id: 'diversification', number: '01', title: 'Đa dạng hoá', description: '' },
      { id: 'connection', number: '02', title: 'Kết nối', description: '' },
      { id: 'income', number: '03', title: 'Thu nhập đa dạng', description: '' },
    ],
  });

  const dependencies: CmsDependency[] = [
    { label: 'Header', connected: !!globals.header, kind: 'global', editHref: '/admin/content/settings/header' },
    { label: 'Footer', connected: !!globals.footer, kind: 'global', editHref: '/admin/content/settings/footer' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CmsEditorStatusBar
        pageTitle="Social Commerce CMS"
        hasUnpublished={hasUnpublished}
        lastEditedBy={page.last_edited_by_identifier}
        lastEditedAt={page.last_edited_at}
        lastPublishedBy={page.last_published_by_identifier}
        lastPublishedAt={page.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPending}
        onPublish={handlePublish}
        publishLabel="Publish Social Commerce"
      />
      <CmsActionFeedback feedback={feedback} />

      <AdminCard>
        <AdminCardHeader><AdminCardTitle>Page Settings</AdminCardTitle></AdminCardHeader>
        <AdminCardContent><HomePageSettingsEditor page={page} /></AdminCardContent>
      </AdminCard>

      <AdminCard>
        <AdminCardHeader><AdminCardTitle>Section Editors</AdminCardTitle></AdminCardHeader>
        <AdminCardContent>
          <Accordion collapsible>
            <AccordionItem value="hero">
              <AccordionTrigger>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Hero <AdminBadge tone="info">Local</AdminBadge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <SocialCommerceHeroEditor pageId={page.id} section={heroSection} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="growth">
              <AccordionTrigger>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Growth <AdminBadge tone="info">Local</AdminBadge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <SocialCommerceGrowthEditor pageId={page.id} section={growthSection} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="social-proof">
              <AccordionTrigger>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Social Proof <AdminBadge tone="info">Local</AdminBadge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <SocialCommerceSocialProofEditor pageId={page.id} section={socialProofSection} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="value-proposition">
              <AccordionTrigger>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Value Proposition <AdminBadge tone="info">Local</AdminBadge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <SocialCommerceValuePropositionEditor pageId={page.id} section={valuePropositionSection} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AdminCardContent>
      </AdminCard>

      <CmsDependenciesCard dependencies={dependencies} />
    </div>
  );
}
