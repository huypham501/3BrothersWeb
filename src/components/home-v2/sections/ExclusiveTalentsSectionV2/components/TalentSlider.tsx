import Image from 'next/image';
import type { ExclusiveTalent } from '../types';
import { useHorizontalSlider } from '../hooks/useHorizontalSlider';
import {
  BottomSlidersArea,
  ScrollbarFill,
  ScrollbarTrack,
  SliderTrack,
  TalentThumb,
  ThumbnailsRow,
  ThumbImagePlaceholder,
  ThumbName,
  VerticalText,
} from '../ExclusiveTalentsSectionV2.styles';

interface TalentSliderProps {
  talents: ExclusiveTalent[];
  talentCountLabel?: string | null;
  activeTalentIndex: number;
  onSelectTalent: (index: number) => void;
}

export function TalentSlider({
  talents,
  talentCountLabel,
  activeTalentIndex,
  onSelectTalent,
}: TalentSliderProps) {
  const {
    rowRef,
    fillRef,
    trackRef,
    isTrackDragging,
    isRowDragging,
    rowEvents,
    trackEvents,
  } = useHorizontalSlider();

  return (
    <BottomSlidersArea>
      <VerticalText>{talentCountLabel}</VerticalText>

      <SliderTrack>
        <ThumbnailsRow ref={rowRef} $isDragging={isRowDragging} {...rowEvents}>
          {talents.map((talent, idx) => (
            <TalentThumb
              key={`${talent.name}-${idx}`}
              onClick={() => onSelectTalent(idx)}
              $active={idx === activeTalentIndex}
            >
              {talent.photo ? (
                <Image
                  src={talent.photo}
                  alt={talent.photo_alt || talent.name}
                  width={240}
                  height={240}
                  style={{ width: '240px', height: '240px', objectFit: 'cover', borderRadius: '8px', flex: 'none' }}
                />
              ) : (
                <ThumbImagePlaceholder />
              )}
              <ThumbName>{talent.name}</ThumbName>
            </TalentThumb>
          ))}
        </ThumbnailsRow>

        <ScrollbarTrack ref={trackRef} $isDragging={isTrackDragging} {...trackEvents}>
          <ScrollbarFill ref={fillRef} />
        </ScrollbarTrack>
      </SliderTrack>
    </BottomSlidersArea>
  );
}
