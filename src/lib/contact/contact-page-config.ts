import type { GlobalContactPagePayload } from '@/lib/cms/types';

export const DEFAULT_CONTACT_PAGE_CONFIG: GlobalContactPagePayload = {
  eyebrow: 'Đừng ngần ngại',
  title: 'LIÊN HỆ NGAY ĐỂ NHẬN TƯ VẤN',
  submit_label: 'Liên hệ tư vấn',
  success_message: 'Cảm ơn bạn đã liên hệ. 3Brothers sẽ phản hồi trong thời gian sớm nhất.',
  error_message: 'Hiện chưa thể gửi thông tin liên hệ. Vui lòng thử lại sau.',
  rate_limit_message: 'Không thể gửi thông tin lúc này. Vui lòng thử lại sau.',
  fields: {
    fullname: {
      enabled: true,
      label: 'Họ Tên',
      placeholder: 'Họ Tên',
      required: true,
    },
    email: {
      enabled: true,
      label: 'Email',
      placeholder: 'Email',
      required: false,
    },
    phone: {
      enabled: true,
      label: 'Số điện thoại',
      placeholder: 'Số điện thoại',
      required: false,
    },
    message: {
      enabled: true,
      label: 'Lời nhắn',
      placeholder: 'Lời nhắn',
      required: false,
    },
  },
  recipient_email: 'work.3brothers@gmail.com',
  email_subject_prefix: '[3Brothers Contact]',
};
