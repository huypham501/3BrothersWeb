import type { NextRequest } from "next/server";
import { createSupabaseRouteClient } from "./server";

export async function updateSession(request: NextRequest) {
  const { supabase, response } = createSupabaseRouteClient(request);

  try {
    await supabase.auth.getUser();
  } catch (error) {
    console.error("Supabase proxy refresh failed", error);
  }

  return response;
}
