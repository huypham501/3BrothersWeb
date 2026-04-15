'use client';

import styled from "styled-components";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { AdminTopNav } from "@/components/admin/layout/AdminTopNav";
import { CONTENT_MODULE_NAV } from "@/components/admin/layout/nav-items";
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";

type AdminPageViewProps = {
  userEmail: string;
  forbidden?: boolean;
};

export function AdminPageView({ userEmail, forbidden = false }: AdminPageViewProps) {
  return (
    <AdminShell maxWidth="880px">
      <AdminTopNav items={CONTENT_MODULE_NAV} activeHref="/admin/content" />
      <Card>
        <AdminPageHeader
          title="Admin"
          description={`Signed in as ${userEmail}.`}
        />
        {forbidden && <Notice>You do not have permission to access the requested CMS module.</Notice>}
        <Body>
          <Link href="/admin/content">Open Content Admin</Link> to manage Home, For Creators, Shared Sections, Global Settings, and audit trails.
        </Body>
        <Actions>
          <SignOutButton />
          <Link href="/admin/content">Content Admin</Link>
        </Actions>
      </Card>
    </AdminShell>
  );
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #cbd5e1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Notice = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #7c2d12;
`;

const Body = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #334155;

  a {
    color: #0f172a;
    font-weight: 600;
    text-decoration: underline;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;

  a {
    color: #0f172a;
    font-weight: 600;
    text-decoration: none;
  }
`;
