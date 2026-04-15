'use client';

import styled from "styled-components";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Container } from "@/components/primitives/Container";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { H2 } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

type AdminPageViewProps = {
  userEmail: string;
  forbidden?: boolean;
};

export function AdminPageView({ userEmail, forbidden = false }: AdminPageViewProps) {
  return (
    <PageRoot>
      <Header />
      <MainContent>
        <Container $size="md">
          <Card>
            <H2>Admin</H2>
            <Text $color="muted">Signed in as {userEmail}.</Text>
            {forbidden && (
              <Text $color="muted">
                You do not have permission to access the requested CMS module.
              </Text>
            )}
            <Text>
              <Link href="/admin/content">Open Content Admin</Link> to manage Home, For Creators, Shared Sections, and Global Settings.
            </Text>
            <Actions>
              <SignOutButton />
              <Link href="/admin/content">Content Admin</Link>
              <Link href="/admin/content/audit">CMS Audit</Link>
              <Link href="/admin/content/pages/for-creators">For Creators CMS</Link>
              <Link href="/admin/content/shared">Shared Sections</Link>
              <Link href="/admin/content/settings">Global Settings</Link>
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

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    text-decoration: none;
  }
`;
