import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

export async function createSupabaseServerClient(
  cookieStorePromise: ReturnType<typeof cookies> = cookies()
): Promise<SupabaseClient> {
  const cookieStore = await cookieStorePromise;
  const { url, key } = getSupabaseConfig();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // In RSC the cookie store is read-only; middleware.ts will handle refresh.
        }
      },
    },
  });
}

export function createSupabaseRouteClient(
  request: NextRequest,
  response?: NextResponse
): { supabase: SupabaseClient; response: NextResponse } {
  const { url, key } = getSupabaseConfig();
  let supabaseResponse =
    response ??
    NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        if (!response) {
          supabaseResponse = NextResponse.next({ request });
        }

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, response: supabaseResponse };
}
