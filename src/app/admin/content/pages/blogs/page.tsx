import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { getAllBlogPostsForAdmin } from '@/lib/cms/queries';
import { BlogPostListTable } from '@/components/admin/cms/BlogPostListTable';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function BlogsAdminListPage() {
  await requireAdminUser('/admin/content/pages/blogs', 'edit_draft');
  const posts = await getAllBlogPostsForAdmin();

  return (
    <AdminShell maxWidth="1100px">
      <AdminPageHeader
        title="Blog Posts"
        description="Manage all blog posts. Create, edit, publish, or delete posts."
      />
      <BlogPostListTable posts={posts} />
    </AdminShell>
  );
}
