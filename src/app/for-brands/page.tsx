import { ForBrandsView } from '@/components/forBrands/ForBrandsView';
import { getGlobalSetting } from '@/lib/cms/queries';
import { SCHEMA_KEYS } from '@/lib/cms/constants/schema-keys';
import {
  resolveGlobalContentBySchemaKey,
  validateCmsPayloadBySchemaKey,
} from '@/lib/cms/resolvers/utils/cms-content';

export const revalidate = false;

const FOR_BRANDS_FALLBACK_DATA = {
  hero: {
    title: 'Kết Nối Thương Hiệu\nVới Influencers',
    subtitle:
      'Giải pháp influencer marketing toàn diện giúp thương hiệu tiếp cận đúng khách hàng, đúng thời điểm, với đúng người ảnh hưởng.',
    primaryCtaLabel: 'Liên hệ tư vấn',
    primaryCtaUrl: '/contact',
    secondaryCtaLabel: 'Xem case studies',
    secondaryCtaUrl: '/social-commerce',
  },
  globals: {
    header: null,
    footer: {
      thank_you_heading: 'THANK YOU!',
      email: 'hello@3brothers.media',
      address: 'Ho Chi Minh City, Vietnam',
      menu_links: [
        { label: 'Home', url: '/' },
        { label: 'For Creators', url: '/for-creators' },
        { label: 'For Brands', url: '/for-brands' },
      ],
      social_links: [
        { label: 'Facebook', url: '#' },
        { label: 'LinkedIn', url: '#' },
      ],
      brand_watermark: '3BROTHERS.MEDIA',
    },
  },
};

export default async function ForBrandsPage() {
  const [headerSetting, footerSetting] = await Promise.all([
    getGlobalSetting(SCHEMA_KEYS.GLOBAL_HEADER),
    getGlobalSetting(SCHEMA_KEYS.GLOBAL_FOOTER),
  ]);

  const header = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.GLOBAL_HEADER,
    resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_HEADER>(headerSetting),
    'for-brands.globals.header'
  );

  const footer = validateCmsPayloadBySchemaKey(
    SCHEMA_KEYS.GLOBAL_FOOTER,
    resolveGlobalContentBySchemaKey<typeof SCHEMA_KEYS.GLOBAL_FOOTER>(footerSetting),
    'for-brands.globals.footer'
  );

  return (
    <ForBrandsView
      data={{
        ...FOR_BRANDS_FALLBACK_DATA,
        globals: {
          header: header ?? FOR_BRANDS_FALLBACK_DATA.globals.header,
          footer: footer ?? FOR_BRANDS_FALLBACK_DATA.globals.footer,
        },
      }}
    />
  );
}
