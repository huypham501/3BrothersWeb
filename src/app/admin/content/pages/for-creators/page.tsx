import Link from 'next/link';
import { getForCreatorsPageData } from '@/lib/cms/queries';
import { ForCreatorsPageEditor } from '@/components/admin/cms/ForCreatorsPageEditor';
import { Button } from '@/components/ui/Button';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';

export const dynamic = 'force-dynamic';

export default async function ForCreatorsCmsAdminPage() {
  const actor = await requireAdminUser('/admin/content/pages/for-creators', 'edit_draft');
  const data = await getForCreatorsPageData();

  if (!data) {
    return (
      <div style={{ padding: '24px' }}>
        <h2>For Creators CMS configuration not found.</h2>
        <p>Please run the CMS seed migration for For Creators first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <Button asChild variant="outline" size="sm"><Link href="/admin/content">Content Admin</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/admin/content/pages/home">Home CMS</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/admin/content/pages/for-creators">For Creators CMS</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/admin/content/shared">Shared Sections</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href="/admin/content/settings">Global Settings</Link></Button>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>For Creators CMS Editor</h1>
          <p style={{ color: '#64748b' }}>Manage local sections and SEO metadata for the For Creators page.</p>
        </div>

        <ForCreatorsPageEditor
          page={data.page}
          sections={data.sections}
          globals={data.globals}
          shared={data.shared}
          role={actor.role}
          canPublish={hasCmsCapability(actor.role, 'publish')}
        />
      </div>
    </div>
  );
}
