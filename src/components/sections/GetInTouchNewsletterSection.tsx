'use client';

import styled from 'styled-components';
import { Container } from '@/components/primitives/Container';
import { H2 } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';
import { mq } from '@/styles/mediaQueries';

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
  display: none;

  &.error {
    background: ${({ theme }) => theme.colors.errorBg};
    color: ${({ theme }) => theme.colors.error};
  }

  &.success {
    background: ${({ theme }) => theme.colors.successBg};
    color: ${({ theme }) => theme.colors.success};
  }
`;

export function GetInTouchNewsletterSection() {
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
            <TabHorizontal className="tab-horizontal">
              <NavTabs className="nav nav-tabs nav-justified" id="tab" role="tablist">
                <NavItem className="nav-item active">
                  <NavLink className="nav-link" href="#tab1" data-toggle="tab">
                    I'm a Creator
                  </NavLink>
                </NavItem>
                <NavItem className="nav-item">
                  <NavLink className="nav-link" href="#tab2" data-toggle="tab">
                    Brand / Partner
                  </NavLink>
                </NavItem>
              </NavTabs>
              <TabContent className="tab-content">
                <TabPane className="tab-pane fade in active" id="tab1" role="tabpanel">
                  <Forms className="forms" action="" method="">
                    <FormRow>
                      <FormColumn>
                        <FormGroup className="form-group">
                          <FormLabel className="form-label required">E-MAIL</FormLabel>
                          <FormControl
                            id="get_in_touch_email_creator"
                            className="form-control"
                            type="text"
                            placeholder="example@mail.com"
                          />
                        </FormGroup>
                      </FormColumn>
                      <FormColumn>
                        <FormGroup className="form-group">
                          <FormLabel className="form-label required">
                            YOUR CHANNEL LINK?
                          </FormLabel>
                          <FormControl
                            id="get_in_touch_channel_link_creator"
                            className="form-control"
                            type="text"
                            placeholder="@username"
                          />
                        </FormGroup>
                      </FormColumn>
                    </FormRow>
                    <FormGroup className="form-group">
                      <FormLabel className="form-label required">
                        TELL US YOUR CONCERN
                      </FormLabel>
                      <FormTextarea
                        id="get_in_touch_content_creator"
                        className="form-control"
                        placeholder="Enter text here..."
                        rows={3}
                      />
                    </FormGroup>
                    <FormButton className="form-button">
                      <ButtonWrapper>
                        <Button
                          id="get_in_touch_send_creator"
                          $variant="gradient"
                          $size="xl"
                          type="button"
                        >
                          SUBMIT
                        </Button>
                      </ButtonWrapper>
                      <ContactText className="text">
                        <p className="visit-site">
                          For Creators:{' '}
                          <a href="mailto:support@3brothers.net">support@3brothers.net</a>
                        </p>
                        <p className="visit-site">
                          For Brand:{' '}
                          <a href="mailto:booking@3brothers.net">booking@3brothers.net</a>
                        </p>
                      </ContactText>
                    </FormButton>
                  </Forms>
                </TabPane>
                <TabPane className="tab-pane fade" id="tab2" role="tabpanel">
                  <Forms className="forms" action="" method="">
                    <FormGroup className="form-group">
                      <FormLabel className="form-label required">E-MAIL</FormLabel>
                      <FormControl
                        id="get_in_touch_email"
                        className="form-control"
                        type="text"
                        placeholder="example@mail.com"
                      />
                    </FormGroup>
                    <FormGroup className="form-group">
                      <FormLabel className="form-label required">
                        TELL US YOUR CONCERN
                      </FormLabel>
                      <FormTextarea
                        id="get_in_touch_content"
                        className="form-control"
                        placeholder="Live by passion, amazing!!! Let's go"
                        rows={3}
                      />
                    </FormGroup>
                    <FormButton className="form-button">
                      <ButtonWrapper>
                        <Button
                          id="get_in_touch_send"
                          $variant="gradient"
                          $size="xl"
                          type="button"
                        >
                          SUBMIT
                        </Button>
                      </ButtonWrapper>
                      <ContactText className="text">
                        <p className="visit-site">
                          For Creators:{' '}
                          <a href="mailto:support@3brothers.net">support@3brothers.net</a>
                        </p>
                        <p className="visit-site">
                          For Brand:{' '}
                          <a href="mailto:booking@3brothers.net">booking@3brothers.net</a>
                        </p>
                      </ContactText>
                    </FormButton>
                  </Forms>
                </TabPane>
              </TabContent>
            </TabHorizontal>
          </NewsletterRight>
        </NewsletterRow>

        <MessNewsletter className="mess-newsletter error" />
        <MessNewsletter className="mess-newsletter success" />
      </Container>
    </NewsletterSection>
  );
}
