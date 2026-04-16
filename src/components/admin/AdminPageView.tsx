'use client';

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
      <div>
        <AdminPageHeader
          title="Admin"
          description={`Signed in as ${userEmail}.`}
        />
        {forbidden && <p>You do not have permission to access the requested CMS module.</p>}
        <p>
          <Link href="/admin/content">Open Content Admin</Link> to manage Home, For Creators, Shared Sections, Global Settings, and audit trails.
        </p>
        <div>
          <SignOutButton />
          <Link href="/admin/content">
            Content Admin
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
