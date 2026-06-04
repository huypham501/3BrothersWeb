import { notFound } from 'next/navigation';
import { AdminContent } from '@/components/admin/layout/AdminShell';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ContactSubmissionDetail } from '@/components/admin/cms/contact-submissions/ContactSubmissionDetail';
import { requireAdminUser } from '@/lib/admin/require-admin-user';
import { ADMIN_METADATA_PAGE_TITLE_LABELS } from '@/lib/admin/admin-metadata-title-map';
import {
  getContactSubmissionById,
  getSafeContactSubmissionsReturnTo,
} from '@/lib/contact/contact-submissions.queries';

export const metadata = {
  title: ADMIN_METADATA_PAGE_TITLE_LABELS.contactSubmissionDetail,
};

export const dynamic = 'force-dynamic';

type ContactSubmissionDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactSubmissionDetailPage({
  params,
  searchParams,
}: ContactSubmissionDetailPageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams ? searchParams : Promise.resolve(undefined),
  ]);
  await requireAdminUser(`/admin/content/contact-submissions/${id}`, 'view');
  const submission = await getContactSubmissionById(id);

  if (!submission) {
    notFound();
  }

  const returnTo = getSafeContactSubmissionsReturnTo(resolvedSearchParams?.returnTo);

  return (
    <AdminContent maxWidth="960px">
      <AdminPageHeader
        title="Contact Submission"
        description="Review submitted contact data and Phase 1 mail delivery status."
      />
      <ContactSubmissionDetail submission={submission} returnTo={returnTo} />
    </AdminContent>
  );
}
