import { getAllBlogPostsForAdmin } from '@/lib/cms/queries';
import { BlogPostListTable } from '@/components/admin/cms/BlogPostListTable';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

export default async function BlogsAdminListPage() {
  const posts = await getAllBlogPostsForAdmin();

  return (
    <AdminContent maxWidth="1100px">
      <AdminPageHeader
        title="Blog Posts"
        description="Manage all blog posts. Create, edit, publish, or delete posts."
      />
      <BlogPostListTable posts={posts} />
    </AdminContent>
  );
}
