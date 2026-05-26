import Image from 'next/image';
import type { ExclusiveTalent } from '../types';
import { useHorizontalSlider } from '../hooks/useHorizontalSlider';
import {
  BottomSlidersArea,
  ScrollbarFill,
  ScrollbarTrack,
  SliderTrack,
  TalentThumbEffectLine,
  TalentThumbImageWrap,
  TalentThumb,
  ThumbnailsRow,
  ThumbImagePlaceholder,
  ThumbName,
  VerticalText,
} from '../ExclusiveTalentsSection.styles';

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
              <TalentThumbImageWrap>
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
                <TalentThumbEffectLine
                  width="240"
                  height="1"
                  viewBox="0 0 240 1"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0.351219C4 0.374679 8 0.396967 12 0.418081C48 0.60811 84 0.703125 120 0.703125C156 0.703125 192 0.60811 228 0.418081C232 0.396967 236 0.374679 240 0.351219C236 0.327758 232 0.305471 228 0.284357C192 0.0943273 156 -0.000687301 120 -0.000687301C84 -0.000687301 48 0.0943273 12 0.284357C8 0.305471 4 0.327758 0 0.351219Z"
                    fill={`url(#talent-thumb-effect-line-gradient-${idx})`}
                  />
                  <defs>
                    <linearGradient
                      id={`talent-thumb-effect-line-gradient-${idx}`}
                      x1="0"
                      y1="1.20312"
                      x2="240"
                      y2="1.20312"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" stopOpacity="0" />
                      <stop offset="0.197345" stopColor="white" />
                      <stop offset="0.798038" stopColor="white" />
                      <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </TalentThumbEffectLine>
              </TalentThumbImageWrap>
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
