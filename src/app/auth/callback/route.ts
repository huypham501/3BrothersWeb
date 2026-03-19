import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/server";

import { getSafeRedirectPath } from "@/lib/auth/utils";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next");
  const redirectPath = getSafeRedirectPath(nextParam);
  const redirectUrl = new URL(redirectPath, requestUrl.origin);

  if (!code) {
    const errorUrl = new URL("/login", requestUrl.origin);
    if (nextParam) {
      errorUrl.searchParams.set("next", nextParam);
    }
    errorUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(errorUrl);
  }

  const redirectResponse = NextResponse.redirect(redirectUrl);
  const { supabase, response } = createSupabaseRouteClient(
    request,
    redirectResponse
  );
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const errorUrl = new URL("/login", requestUrl.origin);
    if (nextParam) {
      errorUrl.searchParams.set("next", nextParam);
    }
    errorUrl.searchParams.set("error", "oauth_callback_failed");
    return NextResponse.redirect(errorUrl);
  }

  return response;
}
