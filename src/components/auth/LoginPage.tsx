'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Container } from '@/components/primitives/Container';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { H2 } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { mq } from '@/styles/mediaQueries';

type LoginStatus = 'idle' | 'submitting';
type AuthMode = 'sign-in' | 'sign-up';

const DEFAULT_REDIRECT = '/admin';

const oauthErrorMessages: Record<string, string> = {
  oauth_callback_failed: 'Unable to complete Google sign-in. Please try again.',
  missing_code: 'Missing OAuth code. Please try signing in again.',
};

function getSafeRedirectPath(nextParam?: string | null) {
  if (nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')) {
    return nextParam;
  }

  return DEFAULT_REDIRECT;
}

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<LoginStatus>('idle');
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
      setError('Email and password are required.');
      setStatus('idle');
      return;
    }

    try {
      if (mode === 'sign-up') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: buildCallbackUrl(),
          },
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          setMessage(
            "Check your inbox to confirm your email. We'll sign you in once it's verified."
          );
          return;
        }

        router.replace(redirectPath);
        return;
      }

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
          : "We couldn't process your request. Please try again.";
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

  const toggleMode = () => {
    setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'));
    setError(null);
    setMessage(null);
  };

  return (
    <PageRoot>
      <div className="wrapper">
        <Header />
        <MainContent>
          <Container $size="sm">
            <Card>
              <Eyebrow>{mode === 'sign-up' ? 'Create account' : 'Welcome back'}</Eyebrow>
              <CardHeader>
                <H2 $align="center">
                  {mode === 'sign-in' ? 'Log in to 3brothers' : 'Create your account'}
                </H2>
                <Text $align="center" $color="muted">
                  {mode === 'sign-in'
                    ? 'Choose your preferred sign-in method to access your account.'
                    : 'Sign up with your email or use Google to get started.'}
                </Text>
              </CardHeader>

              {error && <InlineAlert $tone="error">{error}</InlineAlert>}
              {message && <InlineAlert $tone="success">{message}</InlineAlert>}

              <Form onSubmit={handleSubmit}>
                <Field>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={mode === 'sign-in' ? 'Enter your password' : 'Create a password'}
                    autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                    required
                  />
                </Field>
                <Actions>
                  <Button type="submit" $variant="gradient" $fullWidth disabled={isSubmitting} $rounded>
                    {isSubmitting
                      ? mode === 'sign-in'
                        ? 'Signing in…'
                        : 'Creating account…'
                      : mode === 'sign-in'
                      ? 'Continue'
                      : 'Create account'}
                  </Button>
                </Actions>
              </Form>

              <Divider>
                <span>or</span>
              </Divider>

              <Actions>
                <Button
                  type="button"
                  $variant="outline"
                  $fullWidth
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <ButtonContent>
                    <GoogleBadge aria-hidden="true">G</GoogleBadge>
                    <span>{isSubmitting ? 'Connecting…' : 'Continue with Google'}</span>
                  </ButtonContent>
                </Button>
              </Actions>

              <HelperText>
                {mode === 'sign-in' ? 'New to 3brothers?' : 'Already have an account?'}{' '}
                <ModeSwitch type="button" onClick={toggleMode} disabled={isSubmitting}>
                  {mode === 'sign-in' ? 'Create an account' : 'Sign in instead'}
                </ModeSwitch>
              </HelperText>
              <HelperText>
                Trouble signing in? <a href="mailto:support@3brothers.net">Contact support</a>
              </HelperText>
            </Card>
          </Container>
        </MainContent>
        <Footer />
      </div>
    </PageRoot>
  );
}

const PageRoot = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.bgDark} 0%,
    ${({ theme }) => theme.colors.bgSecondary} 35%,
    ${({ theme }) => theme.colors.bgLight} 72%,
    ${({ theme }) => theme.colors.white} 100%
  );
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing['5xl']} 0 ${({ theme }) => theme.spacing['6xl']};
  display: flex;
  align-items: center;

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing['6xl']} 0 ${({ theme }) => theme.spacing['7xl']};
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  max-width: ${({ theme }) => theme.containerWidths.sm};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2xl']};

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing['2xl']};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
  }
`;

const CardHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  p {
    margin: 0;
  }
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-self: center;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background: ${({ theme }) => theme.colors.secondaryLight};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.borderInput};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.white};
  transition: border-color ${({ theme }) => theme.motion.duration.base}
      ${({ theme }) => theme.motion.easing.easeInOut},
    box-shadow ${({ theme }) => theme.motion.duration.base}
      ${({ theme }) => theme.motion.easing.easeInOut};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 ${({ theme }) => theme.spacing[1]} rgba(0, 60, 166, 0.12);
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.borderLight};
  }
`;

const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const GoogleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing['2xl']};
  height: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const HelperText = styled(Text)`
  margin: 0;
  text-align: center;
`;

const InlineAlert = styled.div<{ $tone: 'error' | 'success' }>`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background: ${({ theme, $tone }) =>
    $tone === 'error' ? theme.colors.errorBg : theme.colors.successBg};
  border: 1px solid
    ${({ theme, $tone }) =>
      $tone === 'error' ? theme.colors.errorBorder : theme.colors.successBorder};
  color: ${({ theme, $tone }) =>
    $tone === 'error' ? theme.colors.errorText : theme.colors.successText};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ModeSwitch = styled.button`
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  padding: 0;
  transition: color ${({ theme }) => theme.motion.duration.base}
    ${({ theme }) => theme.motion.easing.easeInOut};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:disabled {
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }
`;
