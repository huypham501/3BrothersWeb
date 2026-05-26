import Image from 'next/image';
import { useInlineDescriptionClamp } from '../hooks/useInlineDescriptionClamp';
import type { ExclusiveTalent } from '../types';
import {
  DescriptionBlock,
  DescriptionInner,
  MainTalentArea,
  MainTalentPhotoBackgroundEffect,
  MainTalentPhotoEffectLine,
  MainTalentPhotoLayout,
  MainTalentPhotoWrap,
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
} from '../ExclusiveTalentsSection.styles';

export function FeaturedTalentPanel({ activeTalent }: { activeTalent: ExclusiveTalent | null }) {
  const descriptionText = activeTalent?.description || '';
  const featuredPhoto = activeTalent?.featured_photo;
  const featuredPhotoAlt = activeTalent?.featured_photo_alt || activeTalent?.name || 'Featured Talent';
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
      {featuredPhoto ? (
        <MainTalentPhotoLayout>
          <MainTalentPhotoBackgroundEffect
            width="560"
            height="560"
            viewBox="0 0 560 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="main-talent-photo-background-mask"
              style={{ maskType: 'alpha' }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="560"
              height="560"
            >
              <rect width="560" height="560" fill="#D9D9D9" />
            </mask>
            <g mask="url(#main-talent-photo-background-mask)">
              <g filter="url(#main-talent-photo-background-filter-0)">
                <circle
                  cx="278.194"
                  cy="354.968"
                  r="263.742"
                  stroke="url(#main-talent-photo-background-linear-0)"
                  strokeWidth="7.22581"
                />
              </g>
              <circle
                cx="278.194"
                cy="354.968"
                r="263.742"
                fill="url(#main-talent-photo-background-radial-0)"
                fillOpacity="0.4"
              />
              <circle
                cx="278.194"
                cy="354.968"
                r="264.194"
                stroke="url(#main-talent-photo-background-linear-1)"
                strokeOpacity="0.5"
                strokeWidth="0.903226"
              />
              <g filter="url(#main-talent-photo-background-filter-1)">
                <path d="M78.129 158.064L79.3808 181.498L100.258 182.903L79.3808 184.308L78.129 207.742L76.8772 184.308L56 182.903L76.8772 181.498L78.129 158.064Z" fill="white" />
              </g>
              <g filter="url(#main-talent-photo-background-filter-2)">
                <path d="M78.129 167.097L78.921 182.009L92.129 182.903L78.921 183.797L78.129 198.71L77.3371 183.797L64.129 182.903L77.3371 182.009L78.129 167.097Z" fill="white" />
              </g>
              <path d="M78.129 174.323L78.5633 182.418L85.8064 182.903L78.5633 183.389L78.129 191.484L77.6947 183.389L70.4516 182.903L77.6947 182.418L78.129 174.323Z" fill="white" />
            </g>
            <defs>
              <filter
                id="main-talent-photo-background-filter-0"
                x="5.41933"
                y="82.1937"
                width="545.548"
                height="545.548"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="2.70968" result="effect1_foregroundBlur_37_2" />
              </filter>
              <filter
                id="main-talent-photo-background-filter-1"
                x="51.4839"
                y="153.548"
                width="53.2903"
                height="58.7097"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="2.25806" result="effect1_foregroundBlur_37_2" />
              </filter>
              <filter
                id="main-talent-photo-background-filter-2"
                x="62.3226"
                y="165.29"
                width="31.6129"
                height="35.2257"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="0.903226" result="effect1_foregroundBlur_37_2" />
              </filter>
              <linearGradient
                id="main-talent-photo-background-linear-0"
                x1="14.4516"
                y1="91.2258"
                x2="541.935"
                y2="618.71"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.397262" stopColor="white" stopOpacity="0" />
                <stop offset="0.597094" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
              <radialGradient
                id="main-talent-photo-background-radial-0"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(278.194 354.968) rotate(88.7151) scale(242.504 263.808)"
              >
                <stop offset="0.0956054" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <linearGradient
                id="main-talent-photo-background-linear-1"
                x1="14.4516"
                y1="91.2258"
                x2="541.935"
                y2="618.71"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="0.397262" stopColor="white" stopOpacity="0" />
                <stop offset="0.597094" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </MainTalentPhotoBackgroundEffect>

          <MainTalentPhotoWrap>
            <Image
              src={featuredPhoto}
              alt={featuredPhotoAlt}
              width={560}
              height={560}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '16px',
              }}
            />
            <MainTalentPhotoEffectLine
              width="560"
              height="3"
              viewBox="0 0 560 3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.18444e-07 1.35415C9.33333 1.44447 18.6667 1.53028 28 1.61157C112 2.34319 196 2.709 280 2.70901C364 2.70902 448 2.34322 532 1.61161C541.333 1.53032 550.667 1.44452 560 1.35419C550.667 1.26387 541.333 1.17806 532 1.09677C448 0.365152 364 -0.000661261 280 -0.000668604C196 -0.000675948 112 0.365123 28 1.09673C18.6667 1.17802 9.33333 1.26382 1.18444e-07 1.35415Z"
                fill="url(#main-talent-photo-effect-line-gradient)"
              />
              <defs>
                <linearGradient
                  id="main-talent-photo-effect-line-gradient"
                  x1="-4.37114e-08"
                  y1="3.20898"
                  x2="560"
                  y2="3.20903"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0" />
                  <stop offset="0.197345" stopColor="white" />
                  <stop offset="0.798038" stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </MainTalentPhotoEffectLine>
          </MainTalentPhotoWrap>
        </MainTalentPhotoLayout>
      ) : null}

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
