'use client';

import { Button, DatePicker, Form, Select, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import type {
  ContactErrorFilter,
  ContactMailStatus,
  ContactSubmissionListParams,
} from '@/lib/contact/contact-submissions.types';
import { CONTACT_ERROR_CATEGORIES } from '@/lib/contact/contact-submissions.types';
import { CONTACT_ERROR_LABELS } from './contact-submission-labels';

type FilterFormValues = {
  mailStatus?: ContactMailStatus;
  errorCategory?: ContactErrorFilter;
  createdRange?: [Dayjs, Dayjs];
};

interface ContactSubmissionFiltersProps {
  params: ContactSubmissionListParams;
}

export function ContactSubmissionFilters({ params }: ContactSubmissionFiltersProps) {
  const router = useRouter();

  const initialValues: FilterFormValues = {
    mailStatus: params.mailStatus ?? undefined,
    errorCategory: params.errorCategory ?? undefined,
    createdRange:
      params.createdFrom && params.createdTo
        ? [dayjs(params.createdFrom, 'YYYY-MM-DD'), dayjs(params.createdTo, 'YYYY-MM-DD')]
        : undefined,
  };

  const handleFinish = (values: FilterFormValues) => {
    const query = new URLSearchParams();
    query.set('pageSize', String(params.pageSize));

    if (values.mailStatus) query.set('mail_status', values.mailStatus);
    if (values.errorCategory) query.set('error_category', values.errorCategory);
    if (values.createdRange?.[0] && values.createdRange?.[1]) {
      query.set('createdFrom', values.createdRange[0].format('YYYY-MM-DD'));
      query.set('createdTo', values.createdRange[1].format('YYYY-MM-DD'));
    }

    const qs = query.toString();
    router.push(qs ? `/admin/content/contact-submissions?${qs}` : '/admin/content/contact-submissions');
  };

  return (
    <Form layout="inline" initialValues={initialValues} onFinish={handleFinish} style={{ rowGap: 12 }}>
      <Form.Item name="mailStatus" label="Status">
        <Select
          allowClear
          placeholder="All statuses"
          style={{ width: 160 }}
          options={[
            { value: 'success', label: 'Success' },
            { value: 'error', label: 'Error' },
          ]}
        />
      </Form.Item>

      <Form.Item name="errorCategory" label="Category">
        <Select
          allowClear
          placeholder="All categories"
          style={{ width: 240 }}
          options={[
            { value: 'none', label: CONTACT_ERROR_LABELS.none },
            ...CONTACT_ERROR_CATEGORIES.map((category) => ({
              value: category,
              label: CONTACT_ERROR_LABELS[category],
            })),
          ]}
        />
      </Form.Item>

      <Form.Item name="createdRange" label="Created">
        <DatePicker.RangePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Apply
          </Button>
          <Button onClick={() => router.push('/admin/content/contact-submissions')}>Reset</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
