import { notFound } from 'next/navigation';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { hasCmsCapability } from '@/lib/cms/constants/roles';
import { getBlogPostByIdForAdmin } from '@/lib/cms/queries';
import { BlogPostEditor } from '@/components/admin/cms/editors/BlogPostEditor';
import { AdminShell } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const actor = await requireAdminUser(`/admin/content/pages/blogs/${id}`, 'edit_draft');
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
        role={actor.role}
        canPublish={hasCmsCapability(actor.role, 'publish')}
      />
    </AdminShell>
  );
}
