import { getAllBlogPostsForAdmin, getGlobalSettingForAdmin } from '@/lib/cms/queries';
import { BlogAdminTabs } from '@/components/admin/cms/BlogAdminTabs';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';
import { getAdminUiContextFromActor } from '@/lib/admin/require-admin-user';
import { SCHEMA_KEYS } from '@/lib/cms';
import type { GlobalBlogSocialSharePayload } from '@/lib/cms';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.blogsList,
};

export const dynamic = 'force-dynamic';

export default async function BlogsAdminListPage() {
  const [ui, posts, socialShareSetting] = await Promise.all([
    getAdminUiContextFromActor(),
    getAllBlogPostsForAdmin(),
    getGlobalSettingForAdmin<GlobalBlogSocialSharePayload>(SCHEMA_KEYS.GLOBAL_BLOG_SOCIAL_SHARE),
  ]);

  return (
    <AdminContent maxWidth="1100px">
      <AdminPageHeader
        title="Blog Posts"
        description="Manage all blog posts. Create, edit, publish, or delete posts."
      />
      <BlogAdminTabs
        posts={posts}
        socialShareSetting={socialShareSetting}
        role={ui.actor.role}
        canPublish={ui.canPublish}
      />
    </AdminContent>
  );
}
