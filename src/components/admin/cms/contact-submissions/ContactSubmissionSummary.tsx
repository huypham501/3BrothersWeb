'use client';

import { Card, Col, Row, Statistic } from 'antd';
import type { ContactSubmissionSummary as ContactSubmissionSummaryData } from '@/lib/contact/contact-submissions.types';
import { CONTACT_ERROR_LABELS } from './contact-submission-labels';

interface ContactSubmissionSummaryProps {
  summary: ContactSubmissionSummaryData;
}

export function ContactSubmissionSummary({ summary }: ContactSubmissionSummaryProps) {
  const visibleCategories = Object.entries(summary.byCategory)
    .filter(([category, count]) => category !== 'none' && count > 0)
    .slice(0, 4);
  const topCategory = visibleCategories[0];

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={12} lg={topCategory ? 6 : 8}>
        <Card>
          <Statistic title="Total" value={summary.total} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={topCategory ? 6 : 8}>
        <Card>
          <Statistic title="Success" value={summary.success} valueStyle={{ color: '#389e0d' }} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={topCategory ? 6 : 8}>
        <Card>
          <Statistic title="Error" value={summary.error} valueStyle={{ color: '#cf1322' }} />
        </Card>
      </Col>
      {topCategory ? (
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={CONTACT_ERROR_LABELS[topCategory[0] as keyof typeof CONTACT_ERROR_LABELS]}
              value={topCategory[1]}
            />
          </Card>
        </Col>
      ) : null}
    </Row>
  );
}
