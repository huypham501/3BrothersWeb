'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import type { GlobalFooterPayload, GlobalHeaderPayload } from '@/lib/cms/types';

interface NotFoundV2ViewProps {
  header?: GlobalHeaderPayload | null;
  footer?: GlobalFooterPayload | null;
}

export function NotFoundV2View({ header, footer }: NotFoundV2ViewProps) {
  return (
    <PageShell>
      <Header content={header ?? undefined} />

      <Main>
        <Container>
          <ErrorCard>
            <Content>
              <Title>Trang không tồn tại</Title>

              <Description>Có thể đường dẫn đã thay đổi hoặc di chuyển</Description>

              <ActionRow>
                <PrimaryAction href="/">Về trang chủ</PrimaryAction>
              </ActionRow>
            </Content>

            <VisualPanel aria-hidden="true">
              <Digit>404</Digit>
            </VisualPanel>
          </ErrorCard>
        </Container>
      </Main>

      <Footer content={footer ?? undefined} />
    </PageShell>
  );
}

const PageShell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Main = styled.main`
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => `240px ${theme.spacing.lg} ${theme.spacing['6xl']}`};

  ${({ theme }) => theme.mqMax.md} {
    padding: ${({ theme }) => `240px ${theme.spacing.md} ${theme.spacing['4xl']}`};
  }
`;

const Container = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.base};
  max-width: ${({ theme }) => theme.containerWidths.xxl};
  margin: 0 auto;
`;

const ErrorCard = styled.section`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: linear-gradient(140deg, ${({ theme }) => theme.colors.white} 25%, ${({ theme }) => theme.colors.bgLight} 100%);
  overflow: hidden;

  ${({ theme }) => theme.mqMax.lg} {
    grid-template-columns: 1fr;
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => `${theme.spacing['5xl']} ${theme.spacing['4xl']}`};

  ${({ theme }) => theme.mqMax.lg} {
    padding: ${({ theme }) => `${theme.spacing['3xl']} ${theme.spacing.xl}`};
  }

  ${({ theme }) => theme.mqMax.md} {
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  }
`;

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.typography.fontFamily.montserrat};
  font-size: ${({ theme }) => theme.typography.fontSize['6xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme }) => theme.colors.textPrimary};

  ${({ theme }) => theme.mqMax.md} {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }
`;

const Description = styled.p`
  margin: 0;
  max-width: 640px;
  color: ${({ theme }) => theme.colors.textBody};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ActionRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PrimaryAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  padding: 0 ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  transition: all ${({ theme }) => theme.motion.duration.base} ${({ theme }) => theme.motion.easing.easeInOut};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }
`;

const VisualPanel = styled.div`
  position: relative;
  min-height: 420px;
  background: linear-gradient(180deg, #061530 0%, #003ca6 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mqMax.lg} {
    min-height: 320px;
  }
`;

const Digit = styled.div`
  position: relative;
  z-index: 1;
  font-family: ${({ theme }) => theme.typography.fontFamily.montserrat};
  font-size: clamp(96px, 12vw, 180px);
  font-weight: ${({ theme }) => theme.typography.fontWeight.black};
  line-height: 1;
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: -0.04em;
`;
