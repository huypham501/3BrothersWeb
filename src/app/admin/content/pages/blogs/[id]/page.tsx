import { notFound } from 'next/navigation';
import { getBlogPostByIdForAdmin } from '@/lib/cms/queries';
import { BlogPostEditor } from '@/components/admin/cms/editors/BlogPostEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.blogsEdit,
};

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const [ui, { id }] = await Promise.all([
    getAdminUiContextFromActor(),
    params,
  ]);
  const post = await getBlogPostByIdForAdmin(id);

  if (!post) notFound();

  return (
    <AdminContent maxWidth="1100px">
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
    </AdminContent>
  );
}
