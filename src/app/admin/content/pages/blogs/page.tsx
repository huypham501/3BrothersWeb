import { getAllBlogPostsForAdmin } from '@/lib/cms/queries';
import { BlogPostListTable } from '@/components/admin/cms/BlogPostListTable';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.blogsList,
};

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
