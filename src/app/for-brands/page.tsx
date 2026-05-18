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
  solutions: {
    title: 'Giải Pháp Influencer Marketing\nToàn Diện',
    items: [
      'Content partnership',
      'Sponsorship',
      'Distribution',
      'Influencer marketing',
    ] as [string, string, string, string],
  },
  caseStudies: {
    eyebrow: 'Case studies',
    title: 'Chiến Dịch Thực Tế',
    featuredBrand: 'Gillette',
    featuredProject: 'Dự án ABC',
    featuredStats: [
      { value: '3.5M+', label: 'Followers' },
      { value: '71.2M+', label: 'Likes' },
    ],
    featuredDescription:
      'Là một trong những gương mặt gắn bó cùng 3Brothers từ những ngày đầu, Nguyệt Busi đang từng bước xây dựng dấu ấn trong cộng đồng làm đẹp thông qua những nội dung được chia sẻ từ trải nghiệm thực tế.',
    brandCards: [
      { brand: 'Gillette', metric: '70M+ Video views', active: true },
      { brand: 'Dior', metric: '70M+ Video views' },
      { brand: "L'Oréal", metric: '70M+ Video views' },
      { brand: 'klairs', metric: '70M+ Video views' },
      { brand: 'YSL', metric: '70M+ Video views' },
    ],
    categories: ['Lifestyle', 'Beauty', 'Gaming', 'Entertainment', 'Pets', 'Travel', 'Sport'],
  },
  progress: {
    title: 'Chúng Tôi Làm Việc Như Thế Nào',
    subtitle: 'Quy trình 4 bước rõ ràng và minh bạch, từ lúc nhận brief đến khi báo cáo kết quả cuối cùng.',
    steps: [
      {
        title: 'Tiếp Nhận Brief',
        description: 'Hiểu rõ nhu cầu, mục tiêu và ngân sách của thương hiệu.',
      },
      {
        title: 'Lập Chiến Lược',
        description: 'Xây dựng chiến lược và lựa chọn influencers phù hợp nhất với thương hiệu.',
      },
      {
        title: 'Triển Khai',
        description: 'Thực thi chiến dịch, sản xuất nội dung và phân phối trên các nền tảng.',
      },
      {
        title: 'Báo Cáo Kết Quả',
        description: 'Đánh giá chi tiết hiệu quả, ROI và tối ưu chiến dịch liên tục.',
      },
    ],
  },
  cta: {
    heading: 'Sẵn Sàng Nâng Tầm\nChiến Dịch Marketing?',
    subtitle:
      'Liên hệ ngay để nhận tư vấn miễn phí và bắt đầu chiến dịch influencer marketing hiệu quả nhất.',
    ctaLabel: 'Liên hệ hợp tác',
    ctaUrl: '/contact',
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
