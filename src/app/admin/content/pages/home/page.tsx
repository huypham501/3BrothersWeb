import * as React from 'react';
import { getHomePageData } from '@/lib/cms/queries';
import { HomePageEditor } from '@/components/admin/cms/HomePageEditor';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';

// We temporarily use a plain render because AdminPageView isn't fully adaptable for this full bleed interface without modifying it, but let's emulate the Admin context.
export const dynamic = 'force-dynamic';

export default async function HomeCmsAdminPage() {
  const actor = await requireAdminUser('/admin/content/pages/home', 'edit_draft');
  const data = await getHomePageData();

  if (!data) {
    return (
      <div style={{ padding: '24px' }}>
        <h2>Home CMS configuration not found.</h2>
        <p>Please run the CMS seed script first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/content">Content Admin</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/content/pages/home">Home CMS</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/content/pages/for-creators">For Creators CMS</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/content/shared">Shared Sections</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/content/settings">Global Settings</Link>
            </Button>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Home CMS Editor</h1>
          <p style={{ color: '#64748b' }}>Manage the contents and SEO of the Home Page.</p>
        </div>
        <HomePageEditor 
          page={data.page} 
          sections={data.sections} 
          shared={data.shared} 
          role={actor.role}
          canPublish={hasCmsCapability(actor.role, 'publish')}
          canManageShared={hasCmsCapability(actor.role, 'manage_shared_sections')}
        />
      </div>
    </div>
  );
}
