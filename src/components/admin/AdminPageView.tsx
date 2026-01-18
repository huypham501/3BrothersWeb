'use client';

import styled from "styled-components";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container } from "@/components/primitives/Container";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { H2 } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

type AdminPageViewProps = {
  userEmail: string;
};

export function AdminPageView({ userEmail }: AdminPageViewProps) {
  return (
    <PageRoot>
      <Header />
      <MainContent>
        <Container $size="md">
          <Card>
            <H2>Admin</H2>
            <Text $color="muted">Signed in as {userEmail}.</Text>
            <Actions>
              <SignOutButton />
            </Actions>
          </Card>
        </Container>
      </MainContent>
      <Footer />
    </PageRoot>
  );
}

const PageRoot = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.bgDark} 0%,
    ${({ theme }) => theme.colors.bgSecondary} 35%,
    ${({ theme }) => theme.colors.bgLight} 72%,
    ${({ theme }) => theme.colors.white} 100%
  );
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['5xl']} 0 ${({ theme }) => theme.spacing['6xl']};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  max-width: ${({ theme }) => theme.containerWidths.md};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;
