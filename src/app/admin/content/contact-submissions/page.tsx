import { Card, Space } from 'antd';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ContactSubmissionFilters } from '@/components/admin/cms/contact-submissions/ContactSubmissionFilters';
import { ContactSubmissionList } from '@/components/admin/cms/contact-submissions/ContactSubmissionList';
import { ContactSubmissionSummary } from '@/components/admin/cms/contact-submissions/ContactSubmissionSummary';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';
import {
  buildContactSubmissionsListPath,
  getContactSubmissionList,
} from '@/lib/contact/contact-submissions.queries';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.contactSubmissions,
};

export const dynamic = 'force-dynamic';

type ContactSubmissionsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactSubmissionsPage({ searchParams }: ContactSubmissionsPageProps) {
  await requireAdminUser('/admin/content/contact-submissions', 'view');
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const result = await getContactSubmissionList(resolvedSearchParams);
  const listPath = buildContactSubmissionsListPath(result.params);

  return (
    <AdminContent maxWidth="1280px">
      <AdminPageHeader
        title="Contact Submissions"
        description="Inspect contact form submissions, mail status, and operational error categories."
      />

      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <ContactSubmissionSummary summary={result.summary} />

        <Card>
          <ContactSubmissionFilters params={result.params} />
        </Card>

        <Card>
          <ContactSubmissionList
            rows={result.rows}
            params={result.params}
            total={result.total}
            listPath={listPath}
          />
        </Card>
      </Space>
    </AdminContent>
  );
}
