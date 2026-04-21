import { BlogPostEditor } from '@/components/admin/cms/editors/BlogPostEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContext } from '@/lib/admin/require-admin-user';

export const dynamic = 'force-dynamic';

export default async function NewBlogPostPage() {
  const ui = await getAdminUiContext('/admin/content/pages/blogs/new');

  return (
    <AdminShell maxWidth="900px">
      <AdminPageHeader
        title="New Blog Post"
        description="Create a new draft blog post. Save it and publish when ready."
      />
      <BlogPostEditor
        mode="create"
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminShell>
  );
}
