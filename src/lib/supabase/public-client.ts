import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './config';

/**
 * A stateless Supabase client for use in public Server Components.
 *
 * Unlike createSupabaseServerClient(), this client does NOT read cookies or
 * request headers, so Next.js will NOT opt the calling component out of the
 * static cache. Use this wherever you need to fetch publicly-readable CMS
 * data from server components that should benefit from ISR caching.
 *
 * Do NOT use this client for any authenticated operations (admin writes, etc.).
 */
export function createSupabasePublicClient(): SupabaseClient {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key);
}
