'use client';

import Link from 'next/link';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ContactSubmissionRow } from '@/lib/contact/contact-submissions.types';
import {
  CONTACT_ERROR_HINTS,
  CONTACT_STATUS_COLORS,
  CONTACT_STATUS_LABELS,
  formatContactDate,
  getErrorCategoryColor,
  getErrorCategoryLabel,
} from './contact-submission-labels';

interface ContactSubmissionDetailProps {
  submission: ContactSubmissionRow;
  returnTo: string;
}

function displayValue(value: string | null) {
  return value || <Typography.Text type="secondary">-</Typography.Text>;
}

export function ContactSubmissionDetail({ submission, returnTo }: ContactSubmissionDetailProps) {
  const categoryKey = submission.error_category ?? 'none';

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Link href={returnTo}>
        <Button icon={<ArrowLeftOutlined />}>Back to submissions</Button>
      </Link>

      <Card>
        <Descriptions title="Submission" bordered column={1}>
          <Descriptions.Item label="Status">
            <Tag color={CONTACT_STATUS_COLORS[submission.mail_status]}>
              {CONTACT_STATUS_LABELS[submission.mail_status]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Error category">
            <Space direction="vertical" size={4}>
              <Tag color={getErrorCategoryColor(submission.error_category)}>
                {getErrorCategoryLabel(submission.error_category)}
              </Tag>
              <Typography.Text type="secondary">{CONTACT_ERROR_HINTS[categoryKey]}</Typography.Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Created">{formatContactDate(submission.created_at)}</Descriptions.Item>
          <Descriptions.Item label="Updated">{formatContactDate(submission.updated_at)}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Descriptions title="Contact data" bordered column={1}>
          <Descriptions.Item label="Full name">{displayValue(submission.fullname)}</Descriptions.Item>
          <Descriptions.Item label="Email">{displayValue(submission.email)}</Descriptions.Item>
          <Descriptions.Item label="Phone">{displayValue(submission.phone)}</Descriptions.Item>
          <Descriptions.Item label="Message">
            <Typography.Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {displayValue(submission.message)}
            </Typography.Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Descriptions title="Enabled field snapshot" bordered column={1}>
          <Descriptions.Item label="Snapshot">
            <Typography.Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {submission.enabled_field_snapshot
                ? JSON.stringify(submission.enabled_field_snapshot, null, 2)
                : '-'}
            </Typography.Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  );
}
