import { redirect } from "next/navigation";
import { AdminPageView } from "@/components/admin/AdminPageView";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect(`/login?next=${encodeURIComponent("/admin")}`);
  }

  return <AdminPageView userEmail={data?.user?.email ?? "user"} />;
}
