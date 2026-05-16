import { BlogPostEditor } from '@/components/admin/cms/editors/BlogPostEditor';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.blogsNew,
};

export const dynamic = 'force-dynamic';

export default async function NewBlogPostPage() {
  const ui = await getAdminUiContextFromActor();

  return (
    <AdminContent maxWidth="1100px">
      <AdminPageHeader
        title="New Blog Post"
        description="Create a new draft blog post. Save it and publish when ready."
      />
      <BlogPostEditor
        mode="create"
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
