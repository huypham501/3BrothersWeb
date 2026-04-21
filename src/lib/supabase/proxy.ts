import type { NextRequest } from "next/server";
import { createSupabaseRouteClient } from "./server";

export async function updateSession(request: NextRequest) {
  const { response } = createSupabaseRouteClient(request);

  return response;
}
