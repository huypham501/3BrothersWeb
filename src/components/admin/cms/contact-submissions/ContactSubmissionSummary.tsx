'use client';

import { Card, Col, Row, Statistic } from 'antd';
import type { ContactSubmissionSummary as ContactSubmissionSummaryData } from '@/lib/contact/contact-submissions.types';
import { CONTACT_ERROR_LABELS } from './contact-submission-labels';

interface ContactSubmissionSummaryProps {
  summary: ContactSubmissionSummaryData;
}

export function ContactSubmissionSummary({ summary }: ContactSubmissionSummaryProps) {
  const visibleCategories = Object.entries(summary.byCategory)
    .filter(([, count]) => count > 0)
    .slice(0, 4);

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Total" value={summary.total} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Success" value={summary.success} valueStyle={{ color: '#389e0d' }} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Error" value={summary.error} valueStyle={{ color: '#cf1322' }} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title={visibleCategories[0] ? CONTACT_ERROR_LABELS[visibleCategories[0][0] as keyof typeof CONTACT_ERROR_LABELS] : 'Top category'}
            value={visibleCategories[0]?.[1] ?? 0}
          />
        </Card>
      </Col>
    </Row>
  );
}
