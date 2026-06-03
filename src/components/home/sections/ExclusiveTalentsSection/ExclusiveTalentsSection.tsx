'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SharedExclusiveTalentsPayload } from '@/lib/cms/types';
import { FeaturedTalentPanel } from './components/FeaturedTalentPanel';
import { TalentSlider } from './components/TalentSlider';
import {
  GlowEllipse1,
  GlowEllipse12,
  GlowEllipse2,
  SectionGlowWrapper,
  SectionContainer,
  Title,
  TitleLine,
  TitleRow,
} from './ExclusiveTalentsSection.styles';

export function ExclusiveTalentsSection({ content }: { content: SharedExclusiveTalentsPayload }) {
  const talents = useMemo(() => content.talents || [], [content.talents]);

  const featuredIndex = useMemo(() => {
    const idx = talents.findIndex((talent) => talent.is_featured);
    return idx >= 0 ? idx : 0;
  }, [talents]);

  const [activeTalentIndex, setActiveTalentIndex] = useState(featuredIndex);

  useEffect(() => {
    setActiveTalentIndex(featuredIndex);
  }, [featuredIndex]);

  const activeTalent = talents[activeTalentIndex] || talents[featuredIndex] || null;

  return (
    <SectionGlowWrapper>
      <SectionContainer>
        <GlowEllipse1 />
        <GlowEllipse2 />

        <TitleRow>
          <TitleLine />
          <Title>{content.section_title}</Title>
          <TitleLine />
        </TitleRow>

        <FeaturedTalentPanel activeTalent={activeTalent} />

        <TalentSlider
          talents={talents}
          talentCountLabel={content.talent_count_label}
          activeTalentIndex={activeTalentIndex}
          onSelectTalent={setActiveTalentIndex}
        />
      </SectionContainer>
      <GlowEllipse12 />
    </SectionGlowWrapper>
  );
}
