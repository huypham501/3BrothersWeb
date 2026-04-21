import { notFound } from 'next/navigation';
import { getBlogPostByIdForAdmin } from '@/lib/cms/queries';
import { BlogPostEditor } from '@/components/admin/cms/editors/BlogPostEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContext } from '@/lib/admin/require-admin-user';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const ui = await getAdminUiContext('/admin/content/pages/blogs');
  const { id } = await params;
  const post = await getBlogPostByIdForAdmin(id);

  if (!post) notFound();

  return (
    <AdminShell maxWidth="900px">
      <AdminPageHeader
        title={`Edit: ${post.title}`}
        description={`Slug: /blogs/${post.slug}`}
      />
      <BlogPostEditor
        post={post}
        mode="edit"
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminShell>
  );
}
