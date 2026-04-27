import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

export interface CoreCompetencyCardProps {
  title: string;
  description: string;
}

const Montserrat = "'Montserrat', sans-serif";

const ArrowIconSVG = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7.5M17 7V16.5" />
  </svg>
);

export function CoreCompetencyCard({ title, description }: CoreCompetencyCardProps) {
  return (
    <CardContainer>
      <TextGroup>
        <TitleRow>
          <CardTitle>{title}</CardTitle>
          <ArrowIcon>
            <ArrowIconSVG />
          </ArrowIcon>
        </TitleRow>
        <CardDescription>{description}</CardDescription>
      </TextGroup>
      <ImageContainer>
        <ImagePlaceholder>Image Illustration</ImagePlaceholder>
        <HoverOverlay>
          <OverlayContent>
            <span>Xem chi tiết</span>
            <OverlayArrow>
              <ArrowIconSVG />
            </OverlayArrow>
          </OverlayContent>
        </HoverOverlay>
      </ImageContainer>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  position: relative;
  cursor: pointer;

  &:hover {
    ${() => CardTitle} {
      color: ${colors.primary};
    }
    ${() => HoverOverlay} {
      opacity: 1;
    }
    ${() => ArrowIcon} {
      transform: translate(2px, -2px);
    }
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 24px;
`;

const CardTitle = styled.h3`
  font-family: ${Montserrat};
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: ${colors.textPrimary};
  margin: ${spacing[0]};
  transition: color ${motion.duration.base} ${motion.easing.easeOut};

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize.xl};
  }
`;

const ArrowIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
  cursor: pointer;
  flex-shrink: 0;
  transition: transform ${motion.duration.base} ${motion.easing.easeOut};
  margin-top: 4px; /* Align with top of text */
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const CardDescription = styled.p`
  font-family: ${Montserrat};
  font-weight: ${typography.fontWeight.normal};
  font-size: ${typography.fontSize.md};
  line-height: 140%;
  color: ${colors.textPrimary};
  opacity: 0.8;
  margin: ${spacing[0]};
  max-width: 90%;

  ${mediaQueries.down.sm} {
    max-width: 100%;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 612 / 455;
  border-radius: ${spacing.lg};
  border: 8px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0px 4px 24px rgba(6, 21, 48, 0.2);
  background: ${colors.brandLightBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  margin-top: auto;
`;

const ImagePlaceholder = styled.div`
  color: ${colors.primary};
  font-family: ${Montserrat};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.base};
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(6, 21, 48, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ${motion.duration.base} ${motion.easing.easeOut};
  z-index: 2;
`;

const OverlayContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  color: ${colors.white};
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);

  span {
    font-family: ${Montserrat};
    font-weight: ${typography.fontWeight.bold};
    font-size: 26px;
    line-height: 140%;
  }
`;

const OverlayArrow = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;
