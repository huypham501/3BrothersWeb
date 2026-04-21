import { NextResponse } from 'next/server';
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Basic in-memory rate limiting for edge middleware
// Note: In Vercel Edge Runtime, this state persists per isolate.
// It's not globally distributed across edge nodes, but sufficient for basic bot protection on API routes.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { timestamp: now, count: 1 });
    return true;
  }

  // Reset window if elapsed
  if (now - record.timestamp > WINDOW_MS) {
    rateLimitMap.set(ip, { timestamp: now, count: 1 });
    return true;
  }

  // Increment inside window
  record.count += 1;
  return record.count <= MAX_REQUESTS;
}

export async function middleware(request: NextRequest) {
  // 1. Rate Limiting for public API routes
  if (request.nextUrl.pathname.startsWith('/api/') && request.method === 'POST') {
    // Get IP from headers (Vercel specific or standard X-Forwarded-For)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const isAllowed = rateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { message: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }
  }

  // 2. Supabase Auth Session Refresh
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/login',
    '/auth/callback',
  ],
};
