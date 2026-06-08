'use client';

import '@ant-design/v5-patch-for-react-19';
import { Tabs } from 'antd';
import type { CmsBlogPost, CmsGlobalSetting, GlobalBlogSocialSharePayload } from '@/lib/cms';
import { BlogPostListTable } from './BlogPostListTable';
import { BlogSocialShareEditor } from './editors/BlogSocialShareEditor';

interface BlogAdminTabsProps {
  posts: CmsBlogPost[];
  socialShareSetting: CmsGlobalSetting<GlobalBlogSocialSharePayload> | null;
  role: string;
  canPublish: boolean;
}

export function BlogAdminTabs({
  posts,
  socialShareSetting,
  role,
  canPublish,
}: BlogAdminTabsProps) {
  const items = [
    {
      key: 'posts',
      label: 'Posts',
      children: <BlogPostListTable posts={posts} />,
    },
    {
      key: 'social-share',
      label: 'Social Share',
      children: (
        <BlogSocialShareEditor
          setting={socialShareSetting}
          role={role}
          canPublish={canPublish}
        />
      ),
    },
  ];

  return <Tabs defaultActiveKey="posts" items={items} />;
}
