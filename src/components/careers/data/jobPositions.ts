// Shared mock data for Careers — used by OpenPositionSection and CareerDetailView

export interface JobPosition {
  id: number;
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  salary: string;
  postedDaysAgo: number;
  shortDescription: string;
  descriptions: string[];
  requirements: string[];
  benefits: string[];
}

export const JOB_POSITIONS: JobPosition[] = [
  {
    id: 1,
    slug: 'account-executive',
    title: 'Account Executive',
    department: 'Marketing',
    type: 'Full-time',
    location: 'Hồ Chí Minh',
    experience: '1-3 năm',
    salary: 'Thoả thuận',
    postedDaysAgo: 3,
    shortDescription: 'Quản lý và phát triển mối quan hệ với các nhãn hàng đối tác chiến lược.',
    descriptions: ['Tìm kiếm và duy trì quan hệ với khách hàng.'],
    requirements: ['Có kinh nghiệm account management.'],
    benefits: ['Lương cứng + thưởng theo dự án.'],
  },
  {
    id: 2,
    slug: 'content-creator',
    title: 'Content Creator',
    department: 'Creative',
    type: 'Full-time',
    location: 'Hồ Chí Minh',
    experience: '1-2 năm',
    salary: 'Thoả thuận',
    postedDaysAgo: 5,
    shortDescription: 'Sáng tạo và sản xuất nội dung hấp dẫn cho các nền tảng mạng xã hội.',
    descriptions: ['Lên ý tưởng kịch bản video/post.'],
    requirements: ['Có tư duy sáng tạo, bắt trend tốt.'],
    benefits: ['Môi trường làm việc thoải mái, sáng tạo.'],
  },
  {
    id: 3,
    slug: 'kol-specialist',
    title: 'KOL Specialist',
    department: 'Marketing',
    type: 'Full-time',
    location: 'Hồ Chí Minh',
    experience: '1-3 năm',
    salary: 'Thoả thuận',
    postedDaysAgo: 7,
    shortDescription: 'Quản lý và kết nối với mạng lưới KOLs, xây dựng chiến lược influencer.',
    descriptions: ['Lên list KOL/KOC phù hợp chiến dịch.'],
    requirements: ['Hiểu biết về thị trường Influencers.'],
    benefits: ['Bonus campaign.'],
  },
  {
    id: 4,
    slug: 'social-media-manager',
    title: 'Social Media Manager',
    department: 'Marketing',
    type: 'Full-time',
    location: 'Hồ Chí Minh',
    experience: '3+ năm',
    salary: 'Thoả thuận',
    postedDaysAgo: 10,
    shortDescription: 'Phát triển và thực thi chiến lược truyền thông xã hội cho thương hiệu.',
    descriptions: ['Quản lý các kênh social chính.'],
    requirements: ['Có kinh nghiệm leader.'],
    benefits: ['Đãi ngộ hấp dẫn.'],
  },
  {
    id: 5,
    slug: 'video-editor',
    title: 'Video Editor',
    department: 'Creative',
    type: 'Full-time',
    location: 'Hồ Chí Minh',
    experience: '1-3 năm',
    salary: 'Thoả thuận',
    postedDaysAgo: 5,
    shortDescription: 'Biên tập và sản xuất video chất lượng cao cho các nền tảng mạng xã hội.',
    descriptions: [
      'Xây dựng và phát triển các kênh Social của Công ty.',
      'Xây dựng kế hoạch, lên ý tưởng, thiết kế và thực hiện hệ thống video của công ty, sản phẩm...',
      'Luôn luôn cập nhật các xu hướng & đề xuất lên cho cấp trên để thực hiện sản xuất nội dung.',
      'Quản lý kho hình ảnh, video trong hệ thống của công ty.'
    ],
    requirements: [
      'Tốt nghiệp tất cả các ngành nghề liên quan',
      'Ưu tiên Nam, sinh viên mới ra trường, sẽ được đào tạo',
      'Biết sử dụng cơ bản Premiere, Photoshop, Capcut ...',
      'Có khả năng làm việc độc lập và làm việc nhóm tốt.',
      'Kỹ năng tổ chức, sắp xếp công việc và quản lý thời gian hiệu quả.',
      'Có khả năng sáng tạo, tâm huyết với công việc, chăm chỉ, ham học hỏi và tiếp thu nhanh, chịu được áp lực công việc.'
    ],
    benefits: [
      'Công việc ổn định',
      'Môi trường làm việc dân chủ, hiện đại, chuyên nghiệp, có cơ hội thăng tiến và ổn định',
      'Được tăng lương theo lộ trình làm việc.',
      'Được đào tạo nghiệp vụ chuyên sâu.',
      'Được cung cấp thiết bị, máy móc làm việc',
      'Hỗ trợ ăn trưa tại công ty.',
      'Hưởng đầy đủ các chế độ theo quy định của pháp luật: BHXH, phép năm, nghỉ lễ – Tết theo quy định, thưởng tháng 13...'
    ],
  },
  {
    id: 6,
    slug: 'campaign-manager',
    title: 'Campaign Manager',
    department: 'Marketing',
    type: 'Full-time',
    location: 'Hồ Chí Minh',
    experience: '2-4 năm',
    salary: 'Thoả thuận',
    postedDaysAgo: 2,
    shortDescription: 'Lập kế hoạch và triển khai các chiến dịch marketing influencer hiệu quả.',
    descriptions: ['Chạy chiến dịch influencer.'],
    requirements: ['Kỹ năng quản lý dự án tốt.'],
    benefits: ['Thưởng KPIs.'],
  },
  {
    id: 7,
    slug: 'influencer-strategist',
    title: 'Influencer Strategist',
    department: 'Strategy',
    type: 'Full-time',
    location: 'Hồ Chí Minh',
    experience: '2-4 năm',
    salary: 'Thoả thuận',
    postedDaysAgo: 14,
    shortDescription: 'Xây dựng chiến lược dài hạn cho các chiến dịch influencer marketing.',
    descriptions: ['Lên proposal chiến lược.'],
    requirements: ['Kỹ năng thuyết trình, phân tích dữ liệu.'],
    benefits: ['Lương cạnh tranh.'],
  },
  {
    id: 8,
    slug: 'brand-partnership',
    title: 'Brand Partnership',
    department: 'Business',
    type: 'Full-time',
    location: 'Hồ Chí Minh',
    experience: '3+ năm',
    salary: 'Thoả thuận',
    postedDaysAgo: 20,
    shortDescription: 'Phát triển và duy trì các quan hệ đối tác với thương hiệu trong và ngoài nước.',
    descriptions: ['Đàm phán với nhãn hàng lớn.'],
    requirements: ['Mối quan hệ tốt với brands.'],
    benefits: ['Hoa hồng cao.'],
  },
];

export function getJobBySlug(slug: string): JobPosition | undefined {
  return JOB_POSITIONS.find((job) => job.slug === slug);
}
