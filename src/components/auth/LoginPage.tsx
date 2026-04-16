'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { colors, typography, mediaQueries, motion } from '@/styles/tokens';

type LoginStatus = 'idle' | 'submitting';

const DEFAULT_REDIRECT = '/admin';

const oauthErrorMessages: Record<string, string> = {
  oauth_callback_failed: 'Unable to complete Google sign-in. Please try again.',
  missing_code: 'Missing OAuth code. Please try signing in again.',
};

import { getSafeRedirectPath } from '@/lib/auth/utils';

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<LoginStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const nextParam = searchParams?.get('next');
  const redirectPath = getSafeRedirectPath(nextParam);
  const isSubmitting = status === 'submitting';

  useEffect(() => {
    const urlError = searchParams?.get('error');

    if (urlError && oauthErrorMessages[urlError]) {
      setError(oauthErrorMessages[urlError]);
    }
  }, [searchParams]);

  const buildCallbackUrl = () => {
    const base = `${window.location.origin}/auth/callback`;
    const params = new URLSearchParams();

    if (redirectPath) {
      params.set('next', redirectPath);
    }

    const query = params.toString();
    return query ? `${base}?${query}` : base;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu.');
      setStatus('idle');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.replace(redirectPath);
    } catch (authError) {
      const fallbackMessage =
        authError instanceof Error
          ? authError.message
          : 'Đã xảy ra lỗi. Vui lòng thử lại.';
      setError(fallbackMessage);
    } finally {
      setStatus('idle');
    }
  };

  const handleGoogleLogin = async () => {
    setStatus('submitting');
    setError(null);
    setMessage(null);

    const redirectTo = buildCallbackUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      setError(error.message);
      setStatus('idle');
      return;
    }

    if (data?.url) {
      window.location.assign(data.url);
    }
  };

  return (
    <PageRoot>
      {/* ── Left: Hero Panel ────────────────────────────────────────── */}
      <HeroPanel>
        {/* Layered blur blobs */}
        <BlobA />
        <BlobB />
        <BlobC />
        <BlobD />

        {/* Logo centered */}
        <LogoWrapper>
          <Image
            src="/metub/template/images/3brothers-logo-white.png"
            alt="3BROTHERS"
            width={386}
            height={121}
            priority
            style={{ objectFit: 'contain' }}
          />
        </LogoWrapper>
      </HeroPanel>

      {/* ── Right: Form Panel ───────────────────────────────────────── */}
      <FormPanel>
        <FormPanelInner>
          {/* Header text group */}
          <HeaderGroup>
            <PageTitle>Đăng nhập</PageTitle>
            <SubTitle>Nhập thông tin tài khoản để truy cập hệ thống quản trị</SubTitle>
            <BrandName>3BROTHERS.MEDIA</BrandName>
          </HeaderGroup>

          {/* Error / message alerts */}
          {error && <InlineAlert $tone="error">{error}</InlineAlert>}
          {message && <InlineAlert $tone="success">{message}</InlineAlert>}

          {/* Form fields */}
          <StyledForm onSubmit={handleSubmit}>
            <FieldsContainer>
              <InputGroup>
                <StyledInput
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                />
              </InputGroup>

              <InputGroup>
                <StyledInput
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                />
              </InputGroup>

              {/* Remember + Forgot row */}
              <RememberRow>
                <CheckboxLabel>
                  <Checkbox
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Ghi nhớ mật khẩu
                </CheckboxLabel>
                <ForgotLink href="#">Quên mật khẩu?</ForgotLink>
              </RememberRow>
            </FieldsContainer>

            {/* Submit button */}
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </SubmitButton>
          </StyledForm>

          {/* Divider: "Hoặc" */}
          <Divider>
            <DividerLine />
            <DividerText>Hoặc</DividerText>
            <DividerLine />
          </Divider>

          {/* Google Sign-in */}
          <GoogleButton type="button" onClick={handleGoogleLogin} disabled={isSubmitting}>
            <GoogleIcon />
            <span>{isSubmitting ? 'Connecting…' : 'Đăng nhập với Google'}</span>
          </GoogleButton>
        </FormPanelInner>
      </FormPanel>
    </PageRoot>
  );
}

// ── SVG: Google "G" icon ──────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M19.6 10.23c0-.68-.06-1.36-.17-2.01H10v3.8h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.89-1.74 2.98-4.3 2.98-7.31z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H1.07v2.58A10 10 0 0 0 10 20z"
        fill="#34A853"
      />
      <path
        d="M4.41 11.9A6.01 6.01 0 0 1 4.1 10c0-.66.11-1.3.31-1.9V5.52H1.07A10 10 0 0 0 0 10c0 1.61.39 3.14 1.07 4.48l3.34-2.58z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.96c1.47 0 2.78.5 3.82 1.5l2.86-2.87C14.96.99 12.7 0 10 0A10 10 0 0 0 1.07 5.52l3.34 2.58C5.2 5.72 7.4 3.96 10 3.96z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ── Styled components ─────────────────────────────────────────────────────────

/* Full-page split layout: hero left, form right. 1440×1024 from design */
const PageRoot = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 100vh;
  /* Reverted to original neutral background */
  background: #F4F8FF;
  font-family: 'Montserrat', 'Inter', sans-serif;
  overflow: hidden;

  ${mediaQueries.down.lg} {
    flex-direction: column;
  }
`;

/* ── LEFT: Hero panel ────────── */
const HeroPanel = styled.div`
  position: relative;
  /* Increased flex to allow overlap underneath form */
  flex: 1.1; 
  min-height: 100vh;
  background: linear-gradient(180deg, #061530 0%, #003CA6 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0px 24px 40px rgba(0, 0, 0, 0.25));
  z-index: 1;

  ${mediaQueries.down.lg} {
    min-height: 340px;
    flex: none;
    width: 100%;
  }

  ${mediaQueries.down.sm} {
    min-height: 260px;
  }
`;

/* Deep navy blob — top-right glow */
const BlobA = styled.div`
  position: absolute;
  width: 130%;
  height: 1036px;
  left: -20%;
  top: 2%;
  background: #00328A;
  filter: blur(50px);
  transform: matrix(0.85, -0.53, 0.4, 0.92, 0, 0);
  pointer-events: none;
`;

/* Blue glow — upper-left */
const BlobB = styled.div`
  position: absolute;
  width: 110%;
  height: 794px;
  left: -40%;
  top: -60%;
  background: #003CA6;
  filter: blur(50px);
  transform: matrix(-0.88, 0.47, 0.44, 0.9, 0, 0);
  pointer-events: none;
`;

/* Accent — mid-left, brighter blue */
const BlobC = styled.div`
  position: absolute;
  width: 80%;
  height: 482px;
  left: -10%;
  bottom: 10%;
  background: #639CFF;
  filter: blur(32px);
  transform: matrix(0.85, -0.53, 0.4, 0.92, 0, 0);
  pointer-events: none;
`;

/* Lighter accent */
const BlobD = styled.div`
  position: absolute;
  width: 60%;
  height: 370px;
  right: -5%;
  top: -35%;
  background: #6395ED;
  filter: blur(48px);
  transform: matrix(-0.88, 0.47, 0.44, 0.9, 0, 0);
  pointer-events: none;
`;

const LogoWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQueries.down.lg} {
    img {
      width: 240px !important;
      height: auto !important;
    }
  }

  ${mediaQueries.down.sm} {
    img {
      width: 180px !important;
      height: auto !important;
    }
  }
`;

/* ── RIGHT: Form panel ────────── */
const FormPanel = styled.div`
  position: relative;
  flex: 1;
  min-height: 100vh;
  /* Removed background here to allow shadow behind pseudo-background */
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  margin-left: -80px; 

  /* White background layer - placed between shadow and content */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${colors.white};
    border-radius: 80px 0px 0px 80px;
    z-index: 1;
    pointer-events: none;
  }

  /* background shadow to match design (Rectangle 52) */
  &::before {
    content: '';
    position: absolute;
    width: 108%;
    height: 108%;
    left: -4%;
    top: -4%;
    background: #061530;
    filter: blur(100px);
    z-index: 0;
    pointer-events: none;
    opacity: 0.5;
    border-radius: 80px;
  }

  ${mediaQueries.down.lg} {
    width: 100%;
    margin-left: 0;
    min-height: auto;
    padding: 60px 0;
    flex: none;

    &::after {
      border-radius: 40px 40px 0 0;
      border-left: none;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    &::before {
      display: none; /* Hide glow on mobile/tablet to avoid layout issues */
    }
  }

  ${mediaQueries.down.sm} {
    border-radius: 32px 32px 0 0;
    padding: 40px 0;
  }
`;

const FormPanelInner = styled.div`
  position: relative;
  z-index: 2; /* Highest layer: above white background and shadow */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 576px;
  max-width: 90%;
`;

/* ── Header text group ────── */
const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

/* "Đăng nhập" — 42px bold #061530 */
const PageTitle = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 42px;
  line-height: 140%;
  text-align: center;
  color: #061530;
  margin: 0;

  ${mediaQueries.down.sm} {
    font-size: 32px;
  }
`;

/* "Nhập thông tin..." — 16px regular #454545 */
const SubTitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  text-align: center;
  color: #454545;
  margin: 0;
`;

/* "3BROTHERS.MEDIA" — 26px bold uppercase #003CA6 */
const BrandName = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 26px;
  line-height: 140%;
  text-align: center;
  text-transform: uppercase;
  color: ${colors.primary};

  ${mediaQueries.down.sm} {
    font-size: 20px;
  }
`;

/* ── Form ────── */
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

/* Flat underline input matching design exactly — bottom border only */
const StyledInput = styled.input`
  width: 100%;
  padding: 12px 0 24px;
  border: none;
  border-bottom: 1px solid #CACACA;
  background: transparent;
  outline: none;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: #061530;

  transition: border-color ${motion.duration.base} ease;

  &::placeholder {
    color: #061530;
  }

  &:focus {
    border-bottom-color: ${colors.primary};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

/* Remember me + Forgot password row */
const RememberRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const CheckboxLabel = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  color: #061530;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  border: 2px solid ${colors.primary};
  border-radius: 4px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  position: relative;

  &:checked {
    background: ${colors.primary};

    &::after {
      content: '✓';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  }
`;

/* "Quên mật khẩu?" — 16px semibold #003CA6 */
const ForgotLink = styled.a`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 140%;
  color: ${colors.primary};
  text-decoration: none;
  white-space: nowrap;
  transition: opacity ${motion.duration.base} ease;

  &:hover {
    opacity: 0.8;
  }
`;

/* Navy submit button — 576×56, border-radius 48 */
const SubmitButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 32px;
  width: 100%;
  height: 56px;
  background: ${colors.primary};
  border-radius: 48px;
  border: none;
  cursor: pointer;
  transition: background ${motion.duration.base} ease, transform ${motion.duration.base} ease;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: 150%;
  color: ${colors.white};

  &:hover:not(:disabled) {
    background: ${colors.primaryHover};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ── Divider: "Hoặc" ────── */
const Divider = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #D9D9D9;
`;

const DividerText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.normal};
  font-size: 16px;
  line-height: 140%;
  text-align: center;
  color: #828282;
`;

/* Google sign-in — outline border, 576×56, border-radius 48 */
const GoogleButton = styled.button`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 32px;
  gap: 12px;
  width: 100%;
  height: 56px;
  background: transparent;
  border: 1px solid rgba(6, 21, 48, 0.5);
  border-radius: 48px;
  cursor: pointer;
  transition: background ${motion.duration.base} ease, border-color ${motion.duration.base} ease;

  font-family: 'Montserrat', sans-serif;
  font-weight: ${typography.fontWeight.bold};
  font-size: 16px;
  line-height: 150%;
  color: #061530;

  &:hover:not(:disabled) {
    background: rgba(6, 21, 48, 0.04);
    border-color: rgba(6, 21, 48, 0.7);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ── Inline alerts ────── */
const InlineAlert = styled.div<{ $tone: 'error' | 'success' }>`
  width: 100%;
  border-radius: 12px;
  padding: 12px 16px;
  background: ${({ $tone }) =>
    $tone === 'error' ? 'rgba(220, 38, 38, 0.08)' : 'rgba(22, 163, 74, 0.08)'};
  border: 1px solid
    ${({ $tone }) =>
    $tone === 'error' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(22, 163, 74, 0.3)'};
  color: ${({ $tone }) => ($tone === 'error' ? '#dc2626' : '#16a34a')};
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  line-height: 1.5;
`;
