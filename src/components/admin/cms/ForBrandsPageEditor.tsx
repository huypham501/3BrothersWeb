'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  CmsGlobalSetting,
  CmsPage,
  CmsPageSection,
  forBrandsCaseStudiesSchema,
  forBrandsCtaSchema,
  forBrandsHeroSchema,
  forBrandsProgressSchema,
  forBrandsSolutionsSchema,
  globalFooterSchema,
  globalHeaderSchema,
} from '@/lib/cms';
import { publishForBrandsPage } from '@/lib/cms/actions';
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
import { ForBrandsHeroEditor } from './editors/ForBrandsHeroEditor';
import { ForBrandsSolutionsEditor } from './editors/ForBrandsSolutionsEditor';
import { ForBrandsCaseStudiesEditor } from './editors/ForBrandsCaseStudiesEditor';
import { ForBrandsProgressEditor } from './editors/ForBrandsProgressEditor';
import { ForBrandsCtaEditor } from './editors/ForBrandsCtaEditor';

interface ForBrandsPageEditorProps {
  page: CmsPage;
  sections: CmsPageSection[];
  globals: {
    header: CmsGlobalSetting<z.infer<typeof globalHeaderSchema>> | null;
    footer: CmsGlobalSetting<z.infer<typeof globalFooterSchema>> | null;
  };
  role: string;
  canPublish: boolean;
}

export function ForBrandsPageEditor({ page, sections, globals, role, canPublish }: ForBrandsPageEditorProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const hasUnpublished = page.has_unpublished_changes || sections.some((s) => s.has_unpublished_changes);

  const findLocal = <T,>(schemaKey: string) =>
    sections.find((s) => s.schema_key === schemaKey) as CmsPageSection<T> | undefined;

  const heroSection = findLocal<z.infer<typeof forBrandsHeroSchema>>('for_brands.hero.v1');
  const solutionsSection = findLocal<z.infer<typeof forBrandsSolutionsSchema>>('for_brands.solutions.v1');
  const caseStudiesSection = findLocal<z.infer<typeof forBrandsCaseStudiesSchema>>('for_brands.case_studies.v1');
  const progressSection = findLocal<z.infer<typeof forBrandsProgressSchema>>('for_brands.progress.v1');
  const ctaSection = findLocal<z.infer<typeof forBrandsCtaSchema>>('for_brands.cta.v1');

  const dependencies: CmsDependency[] = [
    { label: 'Header', connected: !!globals.header, kind: 'global', editHref: '/admin/content/settings/header' },
    { label: 'Footer', connected: !!globals.footer, kind: 'global', editHref: '/admin/content/settings/footer' },
  ];

  const handlePublish = () => {
    startTransition(async () => {
      try {
        await publishForBrandsPage(page.id);
        alert('Successfully published For Brands content!');
        router.refresh();
      } catch (err) {
        alert('Failed to publish For Brands content. Please try again.');
        console.error(err);
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CmsEditorStatusBar
        pageTitle="For Brands CMS"
        hasUnpublished={hasUnpublished}
        lastEditedBy={page.last_edited_by_identifier}
        lastEditedAt={page.last_edited_at}
        lastPublishedBy={page.last_published_by_identifier}
        lastPublishedAt={page.last_published_at}
        role={role}
        canPublish={canPublish}
        isPublishing={isPending}
        onPublish={handlePublish}
        publishLabel="Publish For Brands"
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
                <AccordionContent><ForBrandsHeroEditor pageId={page.id} section={heroSection} /></AccordionContent>
              </AccordionItem>
            )}
            {solutionsSection && (
              <AccordionItem value="solutions">
                <AccordionTrigger><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Solutions <AdminBadge tone="info">Local</AdminBadge></span></AccordionTrigger>
                <AccordionContent><ForBrandsSolutionsEditor pageId={page.id} section={solutionsSection} /></AccordionContent>
              </AccordionItem>
            )}
            {caseStudiesSection && (
              <AccordionItem value="case-studies">
                <AccordionTrigger><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Case Studies <AdminBadge tone="info">Local</AdminBadge></span></AccordionTrigger>
                <AccordionContent><ForBrandsCaseStudiesEditor pageId={page.id} section={caseStudiesSection} /></AccordionContent>
              </AccordionItem>
            )}
            {progressSection && (
              <AccordionItem value="progress">
                <AccordionTrigger><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Progress <AdminBadge tone="info">Local</AdminBadge></span></AccordionTrigger>
                <AccordionContent><ForBrandsProgressEditor pageId={page.id} section={progressSection} /></AccordionContent>
              </AccordionItem>
            )}
            {ctaSection && (
              <AccordionItem value="cta">
                <AccordionTrigger><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>CTA <AdminBadge tone="info">Local</AdminBadge></span></AccordionTrigger>
                <AccordionContent><ForBrandsCtaEditor pageId={page.id} section={ctaSection} /></AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </AdminCardContent>
      </AdminCard>

      <CmsDependenciesCard dependencies={dependencies} />
    </div>
  );
}
