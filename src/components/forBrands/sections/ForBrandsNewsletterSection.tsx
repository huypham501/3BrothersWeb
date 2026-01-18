'use client';

import styled from "styled-components";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/Button";
import { mq } from "@/styles/mediaQueries";

export function ForBrandsNewsletterSection() {
  return (
    <NewsletterSection aria-label="Newsletter">
      <Container>
        <NewsletterGrid>
          <NewsletterLeft>
            <NewsletterHeading>
              <span>MORE</span> content idea?...Just <span>ONE</span> click!
            </NewsletterHeading>
          </NewsletterLeft>

          <NewsletterRight>
            <Form action="" method="">
              <FormRow>
                <FormField>
                  <FormLabel className="required">FULL NAME</FormLabel>
                  <FormControl
                    id="news_letter_fullname"
                    name="news_letter_fullname"
                    type="text"
                    placeholder="Type your name here ..."
                    autoComplete="name"
                  />
                </FormField>
                <FormField>
                  <FormLabel className="required">E-MAIL</FormLabel>
                  <FormControl
                    id="news_letter_email"
                    name="news_letter_email"
                    type="email"
                    placeholder="Your email. Ex: example@mail.com"
                    autoComplete="email"
                  />
                </FormField>
              </FormRow>

              <FormField>
                <FormLabel className="required">Occupation</FormLabel>
                <FormTextarea
                  id="news_letter_occupation"
                  name="news_letter_occupation"
                  placeholder="Enter text here ..."
                  rows={3}
                />
              </FormField>

              <FormButton>
                <Button id="news_letter_subscribe" $variant="gradient" $size="xl" $rounded type="button">
                  Subscribe now
                </Button>
              </FormButton>
            </Form>
          </NewsletterRight>
        </NewsletterGrid>
      </Container>
    </NewsletterSection>
  );
}

const NewsletterSection = styled.section`
  padding: ${({ theme }) => theme.spacing["5xl"]} 0;
  background-color: ${({ theme }) => theme.colors.bgDark};
  background-image: url(/metub/template/images/bg/bg-newsletter.png);
  background-size: cover;
  background-position: center;

  ${mq.md} {
    padding: ${({ theme }) => theme.spacing["6xl"]} 0;
  }
`;

const NewsletterGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing["3xl"]};

  ${mq.lg} {
    flex-direction: row;
    align-items: center;
  }
`;

const NewsletterLeft = styled.div`
  ${mq.lg} {
    flex: 0 0 50%;
  }
`;

const NewsletterHeading = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme }) => theme.colors.white};

  span {
    display: inline-block;
    color: ${({ theme }) => theme.colors.primary};
  }

  ${mq.md} {
    font-size: ${({ theme }) => theme.typography.fontSize["7xl"]};
  }
`;

const NewsletterRight = styled.div`
  ${mq.lg} {
    flex: 0 0 50%;
  }
`;

const Form = styled.form``;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  ${mq.xl} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-transform: uppercase;

  &.required::after {
    content: " *";
    color: ${({ theme }) => theme.colors.error};
  }
`;

const FormControl = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: border-color ${({ theme }) => theme.motion.duration.base}
    ${({ theme }) => theme.motion.easing.easeInOut};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: border-color ${({ theme }) => theme.motion.duration.base}
    ${({ theme }) => theme.motion.easing.easeInOut};
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;
