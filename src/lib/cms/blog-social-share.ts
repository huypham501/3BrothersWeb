import type { GlobalBlogSocialSharePayload } from './types';

export const DEFAULT_BLOG_SOCIAL_SHARE: GlobalBlogSocialSharePayload = {
  enabled: true,
  platforms: [
    {
      id: 'facebook',
      label: 'Facebook',
      enabled: true,
      url_template: 'https://www.facebook.com/sharer/sharer.php?u={url}',
    },
    {
      id: 'x',
      label: 'X',
      enabled: true,
      url_template: 'https://twitter.com/intent/tweet?url={url}&text={title}',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      enabled: true,
      url_template: '#',
    },
    {
      id: 'youtube',
      label: 'YouTube',
      enabled: true,
      url_template: '#',
    },
  ],
};

export function buildBlogShareUrl(template: string, articleUrl: string, articleTitle: string): string {
  return template
    .replaceAll('{url}', encodeURIComponent(articleUrl))
    .replaceAll('{title}', encodeURIComponent(articleTitle));
}
