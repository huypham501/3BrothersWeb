import styled from 'styled-components';
import { colors, spacing, typography, mediaQueries, motion } from '@/styles/tokens';

export interface CoreCompetencyCardProps {
  title: string;
  description: string;
}

export function CoreCompetencyCard({ title, description }: CoreCompetencyCardProps) {
  return (
    <CardContainer>
      <TextGroup>
        <TitleRow>
          <CardTitle>{title}</CardTitle>
          <ArrowIcon>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </ArrowIcon>
        </TitleRow>
        <CardDescription>{description}</CardDescription>
      </TextGroup>
      <ImageContainer>
        <ImagePlaceholder>Image Illustration</ImagePlaceholder>
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
`;

const CardTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  color: #061530;
  margin: ${spacing[0]};

  ${mediaQueries.down.sm} {
    font-size: ${typography.fontSize.xl};
  }
`;

const ArrowIcon = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #003CA6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #003CA6;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform ${motion.duration.base} ${motion.easing.easeOut};
  
  &:hover {
    transform: translate(2px, -2px);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const CardDescription = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: #061530;
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
  border-radius: 24px;
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
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.base};
`;
