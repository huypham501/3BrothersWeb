import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

export function createSupabaseBrowserClient(): SupabaseClient {
  const { url, key } = getSupabaseConfig();
  return createBrowserClient(url, key);
}
