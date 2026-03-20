'use client';

import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { Container } from '@/components/primitives/Container';
import { H2 } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';
import { mq } from '@/styles/mediaQueries';

// --- Types ---
type TabType = 'creator' | 'brand';

// --- React Component (Logic goes first) ---
export function GetInTouchNewsletterSection() {
  const [activeTab, setActiveTab] = useState<TabType>('creator');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      isCreator: activeTab === 'creator' ? 1 : 0,
      email: formData.get('email'),
      content: formData.get('content'),
      ...(activeTab === 'creator' && { channelLink: formData.get('channelLink') })
    };

    try {
      const res = await fetch('/api/get-in-touch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Submission failed');
      }

      setStatus('success');
      setMessage(result.message || 'Thanks! We will get back to you soon.');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'An error occurred while submitting.');
    }
  };

  return (
    <NewsletterSection aria-label="Get In Touch">
      <Container>
        <NewsletterRow>
          <NewsletterLeft>
            <div className="heading">
              <H2>
                READY TO<span>Create...</span>BY PASSION?
              </H2>
            </div>
          </NewsletterLeft>
          <NewsletterRight>
            <TabHorizontal>
              <NavTabs role="tablist">
                <NavItem className={activeTab === 'creator' ? 'active' : ''}>
                  <NavLink
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('creator');
                      setStatus('idle');
                      setMessage('');
                    }}
                    href="#tab1"
                    role="tab"
                  >
                    I'm a Creator
                  </NavLink>
                </NavItem>
                <NavItem className={activeTab === 'brand' ? 'active' : ''}>
                  <NavLink
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('brand');
                      setStatus('idle');
                      setMessage('');
                    }}
                    href="#tab2"
                    role="tab"
                  >
                    Brand / Partner
                  </NavLink>
                </NavItem>
              </NavTabs>

              <TabContent>
                {/* CREATOR TAB */}
                {activeTab === 'creator' && (
                  <TabPane className="active">
                    <Forms onSubmit={handleSubmit}>
                      <FormRow>
                        <FormColumn>
                          <FormGroup>
                            <FormLabel className="required">E-MAIL</FormLabel>
                            <FormControl
                              name="email"
                              type="email"
                              placeholder="example@mail.com"
                              required
                            />
                          </FormGroup>
                        </FormColumn>
                        <FormColumn>
                          <FormGroup>
                            <FormLabel className="required">YOUR CHANNEL LINK?</FormLabel>
                            <FormControl
                              name="channelLink"
                              type="text"
                              placeholder="@username"
                              required
                            />
                          </FormGroup>
                        </FormColumn>
                      </FormRow>
                      <FormGroup>
                        <FormLabel className="required">TELL US YOUR CONCERN</FormLabel>
                        <FormTextarea
                          name="content"
                          placeholder="Enter text here..."
                          rows={3}
                          required
                        />
                      </FormGroup>
                      <FormButton>
                        <ButtonWrapper>
                          <Button
                            $variant="gradient"
                            $size="xl"
                            type="submit"
                            disabled={status === 'loading'}
                          >
                            {status === 'loading' ? 'SUBMITTING...' : 'SUBMIT'}
                          </Button>
                        </ButtonWrapper>
                        <ContactText>
                          <p>
                            For Creators:{' '}
                            <a href="mailto:support@3brothers.net">support@3brothers.net</a>
                          </p>
                          <p>
                            For Brand:{' '}
                            <a href="mailto:booking@3brothers.net">booking@3brothers.net</a>
                          </p>
                        </ContactText>
                      </FormButton>
                    </Forms>
                  </TabPane>
                )}

                {/* BRAND TAB */}
                {activeTab === 'brand' && (
                  <TabPane className="active">
                    <Forms onSubmit={handleSubmit}>
                      <FormGroup>
                        <FormLabel className="required">E-MAIL</FormLabel>
                        <FormControl
                          name="email"
                          type="email"
                          placeholder="example@mail.com"
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel className="required">TELL US YOUR CONCERN</FormLabel>
                        <FormTextarea
                          name="content"
                          placeholder="Live by passion, amazing!!! Let's go"
                          rows={3}
                          required
                        />
                      </FormGroup>
                      <FormButton>
                        <ButtonWrapper>
                          <Button
                            $variant="gradient"
                            $size="xl"
                            type="submit"
                            disabled={status === 'loading'}
                          >
                            {status === 'loading' ? 'SUBMITTING...' : 'SUBMIT'}
                          </Button>
                        </ButtonWrapper>
                        <ContactText>
                          <p>
                            For Creators:{' '}
                            <a href="mailto:support@3brothers.net">support@3brothers.net</a>
                          </p>
                          <p>
                            For Brand:{' '}
                            <a href="mailto:booking@3brothers.net">booking@3brothers.net</a>
                          </p>
                        </ContactText>
                      </FormButton>
                    </Forms>
                  </TabPane>
                )}
              </TabContent>
            </TabHorizontal>
          </NewsletterRight>
        </NewsletterRow>

        {status === 'error' && (
          <MessNewsletter className="error">
            {message}
          </MessNewsletter>
        )}
        
        {status === 'success' && (
          <MessNewsletter className="success">
            {message}
          </MessNewsletter>
        )}
      </Container>
    </NewsletterSection>
  );
}

// --- Styled Components (Moved to bottom per R6 pattern) ---

const NewsletterSection = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} 0;
  background-color: ${({ theme }) => theme.colors.bgDark};
  background-image: url(/metub/template/images/bg/bg-newsletter.png);
  background-size: cover;
  background-position: center;

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing['5xl']} 0;
  }

  ${mq.lg} {
    padding: ${({ theme }) => theme.spacing['6xl']} 0;
  }
`;

const NewsletterRow = styled.div`
  ${mq.lg} {
    display: flex;
    gap: ${({ theme }) => theme.spacing['3xl']};
  }
`;

const NewsletterLeft = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};

  ${mq.lg} {
    flex: 0 0 50%;
    margin-bottom: 0;
  }
  
  h2 {
    color: ${({ theme }) => theme.colors.white};
    text-transform: uppercase;
    
    span {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const NewsletterRight = styled.div`
  ${mq.lg} {
    flex: 0 0 50%;
  }
`;

const TabHorizontal = styled.div``;

const NavTabs = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing['2xl']};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const NavItem = styled.li`
  flex: 1;
  
  &.active a {
    color: ${({ theme }) => theme.colors.white};
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavLink = styled.a`
  display: block;
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border-bottom: 2px solid transparent;
  transition: all ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const TabContent = styled.div``;

const TabPane = styled.div`
  display: none;
  
  &.active {
    display: block;
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Forms = styled.form``;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-transform: uppercase;

  &.required::after {
    content: ' *';
    color: ${({ theme }) => theme.colors.error};
  }
`;

const FormControl = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: border-color ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  resize: vertical;
  transition: border-color ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormRow = styled.div`
  ${mq.xl} {
    display: flex;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const FormColumn = styled.div`
  ${mq.xl} {
    flex: 1;
  }
`;

const FormButton = styled.div`
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  
  ${mq.md} {
    display: flex;
    gap: ${({ theme }) => theme.spacing.lg};
    align-items: flex-start;
  }
`;

const ButtonWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  ${mq.md} {
    flex: 0 0 auto;
    margin-bottom: 0;
  }
`;

const ContactText = styled.div`
  ${mq.md} {
    flex: 1;
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.white};

    a {
      color: ${({ theme }) => theme.colors.white};
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const MessNewsletter = styled.div`
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: block;

  &.error {
    background: ${({ theme }) => theme.colors.errorBg};
    color: ${({ theme }) => theme.colors.error};
    border: 1px solid ${({ theme }) => theme.colors.errorBorder};
  }

  &.success {
    background: ${({ theme }) => theme.colors.successBg};
    color: ${({ theme }) => theme.colors.success};
    border: 1px solid ${({ theme }) => theme.colors.successBorder};
  }
`;
