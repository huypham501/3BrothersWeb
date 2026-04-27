'use client';

import styled from 'styled-components';
import Link from 'next/link';

import { GlobalFooterPayload } from '@/lib/cms/types';

const DEFAULT_FOOTER_CONTENT: GlobalFooterPayload = {
  thank_you_heading: 'THANK YOU!',
  email: '',
  address: '',
  menu_links: [],
  social_links: [],
  brand_watermark: '3BROTHERS.MEDIA',
};

export function Footer({ content = DEFAULT_FOOTER_CONTENT }: { content?: GlobalFooterPayload }) {
  return (
    <FooterContainer>
      <BackgroundGlow aria-hidden="true">
        <svg viewBox="0 0 1440 640" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.3" filter="url(#footerGlowBlur0)">
            <rect width="700" height="364" transform="matrix(1 0 0.406737 0.913545 -84 399)" fill="url(#footerGlowPaint0)" />
          </g>
          <g opacity="0.3" filter="url(#footerGlowBlur1)">
            <rect width="700" height="364" transform="matrix(1 0 0.406737 0.913545 508 -29)" fill="url(#footerGlowPaint1)" />
          </g>
          <g opacity="0.3" filter="url(#footerGlowBlur2)">
            <rect width="700" height="364" transform="matrix(1 0 0.406737 0.913545 -257 -29)" fill="url(#footerGlowPaint2)" />
          </g>
          <defs>
            <filter id="footerGlowBlur0" x="-204" y="279" width="1088.05" height="572.531" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
            </filter>
            <filter id="footerGlowBlur1" x="388" y="-149" width="1088.05" height="572.531" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
            </filter>
            <filter id="footerGlowBlur2" x="-377" y="-149" width="1088.05" height="572.531" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
            </filter>
            <linearGradient id="footerGlowPaint0" x1="750.526" y1="19.0913" x2="176.894" y2="-214.226" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B4CFFF" stopOpacity="0.6" />
              <stop offset="1" stopColor="#447EE2" />
            </linearGradient>
            <linearGradient id="footerGlowPaint1" x1="750.526" y1="19.0913" x2="176.894" y2="-214.226" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B4CFFF" stopOpacity="0.6" />
              <stop offset="1" stopColor="#447EE2" />
            </linearGradient>
            <linearGradient id="footerGlowPaint2" x1="-50.5262" y1="344.909" x2="523.106" y2="578.226" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6395ED" />
              <stop offset="1" stopColor="#B4CFFF" />
            </linearGradient>
          </defs>
        </svg>
      </BackgroundGlow>
      <TopRow>
        <LeftSide>
          <Heading dangerouslySetInnerHTML={{ __html: content.thank_you_heading.replace(/\n/g, '<br />') }} />
          <ContactInfo>
            <ContactLine>
              <ContactLabel>EMAIL:</ContactLabel>
              <ContactValue>{content.email}</ContactValue>
            </ContactLine>
            <ContactLine>
              <ContactLabel>ĐỊA CHỈ:</ContactLabel>
              <ContactValue>{content.address}</ContactValue>
            </ContactLine>
          </ContactInfo>
        </LeftSide>

        <RightSide>
          <LinkGroup>
            <LinkTitle>MENU</LinkTitle>
            <Links>
              {content.menu_links?.map((link, idx) => (
                <FooterLink key={idx} href={link.url}>{link.label}</FooterLink>
              ))}
            </Links>
          </LinkGroup>

          <LinkGroup>
            <LinkTitle>CONTACT</LinkTitle>
            <Links>
              {content.social_links?.map((link, idx) => (
                <FooterLink key={idx} href={link.url}>{link.label}</FooterLink>
              ))}
            </Links>
          </LinkGroup>
        </RightSide>
      </TopRow>

      <HugeTextContainer>
        <HugeText>{content.brand_watermark}</HugeText>
      </HugeTextContainer>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  position: relative;
  isolation: isolate;
  background: #003ca6;
  min-height: 640px;
  padding: 84px 84px 40px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  font-family: var(--font-montserrat), 'Montserrat', sans-serif;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1200px) {
    min-height: 0;
    padding: 72px 56px 36px;
    gap: 56px;
  }

  @media (max-width: 900px) {
    padding: 56px 24px 28px;
    gap: 48px;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 48px;
  z-index: 2;

  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 44px;
  }
`;

const LeftSide = styled.div`
  width: min(789px, 100%);
`;

const Heading = styled.h2`
  font-weight: 700;
  font-size: clamp(2.2rem, 3.9vw, 56px);
  line-height: 120%;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0;
  opacity: 0.9;

  @media (max-width: 900px) {
    margin-bottom: 16px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContactLine = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: end;
  gap: 20px;

  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const ContactLabel = styled.span`
  font-family: inherit;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 170%;
  letter-spacing: 0;
  text-transform: uppercase;
  opacity: 0.7;
`;

const ContactValue = styled.span`
  font-family: inherit;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: 0;
  min-width: 0;
`;

const RightSide = styled.div`
  display: flex;
  gap: 24px;
  width: min(403px, 100%);

  @media (max-width: 900px) {
    width: 100%;
    gap: 12px;
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex: 1;
  min-width: 0;
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LinkTitle = styled.h4`
  font-family: inherit;
  font-style: normal;
  margin: 0;
  font-weight: 400;
  font-size: 10px;
  line-height: 140%;
  letter-spacing: 0;
  text-transform: uppercase;
  opacity: 0.7;
`;

const FooterLink = styled(Link)`
  font-family: inherit;
  font-style: normal;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: 0;
  text-decoration: none;
  opacity: 1;

  &:hover {
    opacity: 0.82;
  }
`;

const HugeTextContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 2;
`;

const HugeText = styled.h1`
  font-weight: 700;
  font-size: clamp(58px, 9.2vw, 132px);
  line-height: 140%;
  margin: 0;
  opacity: 0.9;
  letter-spacing: -0.04em;
  text-align: center;
  text-transform: uppercase;
  color: #fff;
  white-space: nowrap;

  @media (max-width: 900px) {
    white-space: normal;
    text-align: left;
  }
`;

const BackgroundGlow = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
