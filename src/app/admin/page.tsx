import { redirect } from 'next/navigation';
import { AdminPageView } from '@/components/admin/AdminPageView';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ forbidden?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect('/login?next=%2Fadmin');
  }

  const resolvedSearchParams = (await searchParams) ?? {};

  return (
    <AdminPageView
      userEmail={data.user.email ?? 'user'}
      forbidden={resolvedSearchParams.forbidden === '1'}
    />
  );
}
