'use client';

import * as React from 'react';
import styled from 'styled-components';
import { CmsPage, CmsPageSection, CmsSharedSection, CmsGlobalSetting } from '@/lib/cms';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Accordion, SimpleAccordion } from '../ui/Accordion';
import { Separator } from '../ui/Separator';
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
  globals: {
    header: CmsGlobalSetting | null;
    footer: CmsGlobalSetting | null;
  };
  shared: {
    exclusiveTalents: CmsSharedSection | null;
    contactCta: CmsSharedSection | null;
  };
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

export function HomePageEditor({ page, sections, globals, shared }: HomePageEditorProps) {
  
  // Helper to find local section
  const findLocal = (schemaKey: string) => sections.find(s => s.schema_key === schemaKey);

  const heroSection = findLocal('home.hero.v1');
  const partnersSection = findLocal('home.partners.v1');
  const coreCompetenciesSection = findLocal('home.core_competencies.v1');
  const efficiencySection = findLocal('home.efficiency.v1');
  const trendingSection = findLocal('home.trending.v1');

  return (
    <EditorContainer>
      <Card>
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <HomePageSettingsEditor page={page} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Section Editors</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion>
            {heroSection && (
              <SimpleAccordion 
                title={<SectionHeader>Hero <Badge $variant="local">Local</Badge></SectionHeader>}
              >
                <HomeHeroEditor pageId={page.id} section={heroSection} />
              </SimpleAccordion>
            )}
            
            {partnersSection && (
              <SimpleAccordion 
                title={<SectionHeader>Partners <Badge $variant="local">Local</Badge></SectionHeader>}
              >
                <HomePartnersEditor pageId={page.id} section={partnersSection} />
              </SimpleAccordion>
            )}

            {coreCompetenciesSection && (
              <SimpleAccordion 
                title={<SectionHeader>Core Competencies <Badge $variant="local">Local</Badge></SectionHeader>}
              >
                <HomeCoreCompetenciesEditor pageId={page.id} section={coreCompetenciesSection} />
              </SimpleAccordion>
            )}

            {efficiencySection && (
              <SimpleAccordion 
                title={<SectionHeader>Efficiency <Badge $variant="local">Local</Badge></SectionHeader>}
              >
                <HomeEfficiencyEditor pageId={page.id} section={efficiencySection} />
              </SimpleAccordion>
            )}

            {shared.exclusiveTalents && (
              <SimpleAccordion 
                title={<SectionHeader>Exclusive Talents <Badge $variant="shared">Shared</Badge></SectionHeader>}
              >
                <SharedExclusiveTalentsEditor section={shared.exclusiveTalents} />
              </SimpleAccordion>
            )}

            {shared.contactCta && (
              <SimpleAccordion 
                title={<SectionHeader>Contact CTA <Badge $variant="shared">Shared</Badge></SectionHeader>}
              >
                <SharedContactCtaEditor section={shared.contactCta} />
              </SimpleAccordion>
            )}

            {trendingSection && (
              <SimpleAccordion 
                title={<SectionHeader>Trending <Badge $variant="local">Local</Badge></SectionHeader>}
              >
                <HomeTrendingEditor pageId={page.id} section={trendingSection} />
              </SimpleAccordion>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </EditorContainer>
  );
}
