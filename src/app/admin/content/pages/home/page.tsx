import * as React from 'react';
import { getHomePageData } from '@/lib/cms';
import { HomePageEditor } from '@/components/admin/cms/HomePageEditor';
import { AdminPageView } from '@/components/admin/AdminPageView';

// We temporarily use a plain render because AdminPageView isn't fully adaptable for this full bleed interface without modifying it, but let's emulate the Admin context.
export const dynamic = 'force-dynamic';

export default async function HomeCmsAdminPage() {
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Home CMS Editor</h1>
          <p style={{ color: '#64748b' }}>Manage the contents and SEO of the Home Page.</p>
        </div>
        <HomePageEditor 
          page={data.page} 
          sections={data.sections} 
          globals={data.globals} 
          shared={data.shared} 
        />
      </div>
    </div>
  );
}
