'use client';

import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type {
  CmsAuditActionType,
  CmsAuditEntityType,
} from '@/lib/cms';
import type {
  CmsAuditLogListParams,
} from '@/lib/cms/queries';
import {
  CMS_AUDIT_ACTION_TYPES,
  CMS_AUDIT_ENTITY_TYPES,
} from '@/lib/cms';
import {
  AUDIT_ACTION_LABELS,
  AUDIT_ENTITY_LABELS,
} from './audit-log-labels';

type FilterFormValues = {
  actionType?: CmsAuditActionType;
  entityType?: CmsAuditEntityType;
  actorSearch?: string;
  entitySearch?: string;
  createdRange?: [Dayjs, Dayjs];
};

interface CmsAuditLogFiltersProps {
  params: CmsAuditLogListParams;
}

export function CmsAuditLogFilters({ params }: CmsAuditLogFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialValues: FilterFormValues = {
    actionType: params.actionType ?? undefined,
    entityType: params.entityType ?? undefined,
    actorSearch: params.actorSearch ?? undefined,
    entitySearch: params.entitySearch ?? undefined,
    createdRange:
      params.createdFrom && params.createdTo
        ? [dayjs(params.createdFrom, 'YYYY-MM-DD'), dayjs(params.createdTo, 'YYYY-MM-DD')]
        : undefined,
  };

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const handleFinish = (values: FilterFormValues) => {
    const query = new URLSearchParams();
    query.set('pageSize', String(params.pageSize));

    if (values.actionType) query.set('action_type', values.actionType);
    if (values.entityType) query.set('entity_type', values.entityType);
    if (values.actorSearch?.trim()) query.set('actor', values.actorSearch.trim());
    if (values.entitySearch?.trim()) query.set('entity', values.entitySearch.trim());
    if (values.createdRange?.[0] && values.createdRange?.[1]) {
      query.set('createdFrom', values.createdRange[0].format('YYYY-MM-DD'));
      query.set('createdTo', values.createdRange[1].format('YYYY-MM-DD'));
    }

    const qs = query.toString();
    navigate(qs ? `/admin/content/audit?${qs}` : '/admin/content/audit');
  };

  return (
    <Form
      layout="inline"
      initialValues={initialValues}
      onFinish={handleFinish}
      style={{ rowGap: 12 }}
    >
      <Form.Item name="actionType" label="Action">
        <Select
          allowClear
          placeholder="All actions"
          style={{ width: 160 }}
          options={CMS_AUDIT_ACTION_TYPES.map((actionType) => ({
            value: actionType,
            label: AUDIT_ACTION_LABELS[actionType],
          }))}
        />
      </Form.Item>

      <Form.Item name="entityType" label="Entity">
        <Select
          allowClear
          placeholder="All entities"
          style={{ width: 200 }}
          options={CMS_AUDIT_ENTITY_TYPES.map((entityType) => ({
            value: entityType,
            label: AUDIT_ENTITY_LABELS[entityType],
          }))}
        />
      </Form.Item>

      <Form.Item name="actorSearch" label="Actor">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Email or identifier"
          style={{ width: 220 }}
        />
      </Form.Item>

      <Form.Item name="entitySearch" label="Entity key">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Key or ID"
          style={{ width: 220 }}
        />
      </Form.Item>

      <Form.Item name="createdRange" label="Created">
        <DatePicker.RangePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Apply
          </Button>
          <Button onClick={() => navigate('/admin/content/audit')} disabled={isPending}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
