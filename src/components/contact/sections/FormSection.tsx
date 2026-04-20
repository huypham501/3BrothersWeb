'use client';

import styled from 'styled-components';
import { colors, typography, spacing, mediaQueries, motion } from '@/styles/tokens';

export function FormSection() {
  return (
    <SectionContainer>
      <Inner>
        <HeaderArea>
          <Eyebrow>Đừng ngần ngại</Eyebrow>
          <Title>LIÊN HỆ NGAY ĐỂ NHẬN TƯ VẤN</Title>

          <SocialMediaGroup>
            <SocialButton href="#" aria-label="Facebook">
              <FacebookIcon />
            </SocialButton>
            <SocialButton href="#" aria-label="Twitter">
              <TwitterIcon />
            </SocialButton>
            <SocialButton href="#" aria-label="Instagram">
              <InstagramIcon />
            </SocialButton>
            <SocialButton href="#" aria-label="Youtube">
              <YoutubeIcon />
            </SocialButton>
          </SocialMediaGroup>
        </HeaderArea>

        <FormArea>
          <FormRow>
            <InputGroup>
              <StyledInput type="text" placeholder="Họ Tên" />
            </InputGroup>
            <InputGroup>
              <StyledInput type="email" placeholder="Email" />
            </InputGroup>
          </FormRow>
          
          <FormRow>
            <InputGroup>
              <StyledInput type="tel" placeholder="Số điện thoại" />
            </InputGroup>
          </FormRow>

          <FormRow>
            <InputGroup>
              <StyledTextarea placeholder="Lời nhắn" />
            </InputGroup>
          </FormRow>

          <SubmitAction>
            <SubmitButton type="button">
              Liên hệ tư vấn
              <ChevronRightIcon />
            </SubmitButton>
          </SubmitAction>
        </FormArea>
      </Inner>
    </SectionContainer>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" fill="#003CA6"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M23 3.01006C22.0424 3.68553 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 22.6608 4.40277 23 3.01006Z" fill="#003CA6"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M16 2.01007H8C4.68629 2.01007 2 4.69636 2 8.01007V16.0101C2 19.3238 4.68629 22.0101 8 22.0101H16C19.3137 22.0101 22 19.3238 22 16.0101V8.01007C22 4.69636 19.3137 2.01007 16 2.01007Z" stroke="#003CA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 11.38C16.1234 12.2127 15.9813 13.0622 15.5938 13.8058C15.2063 14.5494 14.5932 15.1481 13.8446 15.5152C13.096 15.8823 12.2513 15.9984 11.4347 15.847C10.6181 15.6956 9.87271 15.2844 9.30849 14.6731C8.74426 14.0617 8.39054 13.2828 8.29749 12.4503C8.20443 11.6177 8.37651 10.7749 8.78913 10.0437C9.20176 9.31252 9.83363 8.73142 10.5925 8.38466C11.3513 8.03789 12.2 7.94279 13.01 8.11007C13.8499 8.28347 14.6067 8.74797 15.1749 9.49397C15.7431 10.2399 16.0968 11.1578 16 12.0101V11.38Z" stroke="#003CA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.5 6.51007H17.51" stroke="#003CA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22.54 6.42C22.2582 5.37891 21.4611 4.58183 20.42 4.3C18.6185 3.8647 12 3.8647 12 3.8647C12 3.8647 5.3815 3.8647 3.58 4.3C2.53891 4.58183 1.74183 5.37891 1.46 6.42C1.04225 8.22557 1.04225 12 1.04225 12C1.04225 12 1.04225 15.7744 1.46 17.58C1.74183 18.6211 2.53891 19.4182 3.58 19.7C5.3815 20.1353 12 20.1353 12 20.1353C12 20.1353 18.6185 20.1353 20.42 19.7C21.4611 19.4182 22.2582 18.6211 22.54 17.58C22.9577 15.7744 22.9577 12 22.9577 12C22.9577 12 22.9577 8.22557 22.54 6.42Z" stroke="#003CA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.75 15.02L15.5 12L9.75 8.98001V15.02Z" stroke="#003CA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.5 15L12.5 10L7.5 5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Styled Components ───────────────────────────────────────────────────────

const SectionContainer = styled.section`
  width: 100%;
  background: #F4F8FF; /* Matches the top part of Contact.png before gradient */
  padding-top: 250px;
  padding-bottom: 200px;
  position: relative;
  z-index: 1;

  ${mediaQueries.down.lg} {
    padding-top: 180px;
    padding-bottom: 120px;
  }
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  padding: 0 80px;

  ${mediaQueries.down.lg} {
    padding: 0 40px;
    gap: 40px;
  }

  ${mediaQueries.down.sm} {
    padding: 0 20px;
  }
`;

/* Header Area */
const HeaderArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 1281px;
  position: relative;
`;

const Eyebrow = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 26px;
  line-height: 140%;
  text-align: center;
  color: #061530;
  margin: 0;

  ${mediaQueries.down.md} {
    font-size: 20px;
  }
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 56px;
  line-height: 140%;
  text-align: center;
  text-transform: uppercase;
  color: #061530;
  margin: 0;

  ${mediaQueries.down.lg} {
    font-size: 40px;
  }

  ${mediaQueries.down.sm} {
    font-size: 32px;
  }
`;

/* Social Media Floating Buttons */
const SocialMediaGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  position: absolute;
  right: 0;
  top: 0;

  ${mediaQueries.down.lg} {
    position: relative;
    flex-direction: row;
    margin-top: 24px;
    right: auto;
    top: auto;
  }
`;

const SocialButton = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  background: ${colors.white};
  box-shadow: 0px 16px 32px -4px rgba(12, 12, 13, 0.1), 0px 4px 4px -4px rgba(12, 12, 13, 0.05);
  border-radius: 12px;
  transition: transform ${motion.duration.base} ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

/* Form Area */
const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
  width: 100%;
  max-width: 961px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 32px;

  ${mediaQueries.down.sm} {
    flex-direction: column;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 12px 24px 12px;
  border: none;
  border-bottom: 1px solid #CACACA;
  background: transparent;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: #000000;
  outline: none;
  transition: border-color ${motion.duration.base} ease;

  &:focus {
    border-bottom-color: ${colors.primary};
  }

  &::placeholder {
    color: #454545;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px 12px 80px 12px;
  border: none;
  border-bottom: 1px solid #CACACA;
  background: transparent;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: #000000;
  outline: none;
  resize: none;
  transition: border-color ${motion.duration.base} ease;

  &:focus {
    border-bottom-color: ${colors.primary};
  }

  &::placeholder {
    color: #454545;
  }
`;

const SubmitAction = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start; /* Matches design: left aligned under form */
`;

const SubmitButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  background: #003CA6;
  border-radius: 48px;
  border: none;
  cursor: pointer;
  transition: box-shadow ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: 140%;
  color: ${colors.white};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 60, 166, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
