import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { BlogPostEditor } from '@/components/admin/cms/editors/BlogPostEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function NewBlogPostPage() {
  const actor = await requireAdminUser('/admin/content/pages/blogs/new', 'edit_draft');

  return (
    <AdminShell maxWidth="900px">
      <AdminPageHeader
        title="New Blog Post"
        description="Create a new draft blog post. Save it and publish when ready."
      />
      <BlogPostEditor
        mode="create"
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
