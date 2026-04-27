import Image from 'next/image';
import { useInlineDescriptionClamp } from '../hooks/useInlineDescriptionClamp';
import type { ExclusiveTalent } from '../types';
import {
  DescriptionBlock,
  DescriptionInner,
  MainTalentArea,
  MeasureDescription,
  MeasureSuffix,
  ReadMoreButton,
  ReadMoreSuffix,
  Stat,
  StatLabel,
  StatsBlock,
  StatValue,
  TalentDescription,
  TalentHandle,
  TalentInfoContent,
  TalentName,
  TalentPhotoMain,
} from '../ExclusiveTalentsSection.styles';

export function FeaturedTalentPanel({ activeTalent }: { activeTalent: ExclusiveTalent | null }) {
  const descriptionText = activeTalent?.description || '';
  const {
    containerRef,
    measureRef,
    measureTextRef,
    measureSuffixRef,
    isExpandable,
    isExpanded,
    setIsExpanded,
    visibleText,
  } = useInlineDescriptionClamp(descriptionText);

  return (
    <MainTalentArea>
      {activeTalent?.photo ? (
        <Image
          src={activeTalent.photo}
          alt={activeTalent.photo_alt || activeTalent.name || 'Featured Talent'}
          width={560}
          height={560}
          style={{
            flex: 'none',
            width: '560px',
            height: '560px',
            objectFit: 'cover',
            borderRadius: '16px',
          }}
        />
      ) : (
        <TalentPhotoMain />
      )}

      <TalentInfoContent>
        <TalentName>{activeTalent?.name || ''}</TalentName>
        <TalentHandle>{activeTalent?.handle || ''}</TalentHandle>

        <StatsBlock>
          {activeTalent?.stats?.map((stat, idx) => (
            <Stat key={`stat-${idx}`}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </Stat>
          ))}
        </StatsBlock>

        <DescriptionBlock>
          <DescriptionInner ref={containerRef}>
            <TalentDescription>
              {!isExpandable || isExpanded ? (
                descriptionText
              ) : (
                <>
                  {visibleText}
                  <ReadMoreSuffix>... </ReadMoreSuffix>
                  <ReadMoreButton onClick={() => setIsExpanded(true)}>xem thêm</ReadMoreButton>
                </>
              )}
            </TalentDescription>

            <MeasureDescription ref={measureRef} aria-hidden="true">
              <span ref={measureTextRef} />
              <MeasureSuffix ref={measureSuffixRef}>... xem thêm</MeasureSuffix>
            </MeasureDescription>
          </DescriptionInner>
        </DescriptionBlock>
      </TalentInfoContent>
    </MainTalentArea>
  );
}
