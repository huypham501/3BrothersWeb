import { createHmac } from 'crypto';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';

export type ContactSpamEventType = 'attempt' | 'honeypot' | 'rate_limit';

export const CONTACT_RATE_LIMIT_MAX_ATTEMPTS = 5;
export const CONTACT_RATE_LIMIT_WINDOW_SECONDS = 10 * 60;

const HASH_SECRET_ENV = 'CONTACT_SPAM_HASH_SECRET';
const ROUTE = '/api/contact';

type SpamIdentity = {
  identityHash: string;
  userAgentHash: string | null;
};

type SpamGuardReady = {
  ok: true;
  identity: SpamIdentity;
};

type SpamGuardUnavailable = {
  ok: false;
};

export type SpamGuardSetup = SpamGuardReady | SpamGuardUnavailable;

export type RateLimitDecision =
  | { limited: false }
  | { limited: true; attemptCount: number };

export function createContactSpamGuardSetup(request: Request): SpamGuardSetup {
  const secret = process.env[HASH_SECRET_ENV];
  if (!secret) {
    console.warn('Contact spam guard skipped: missing hash secret');
    return { ok: false };
  }

  const route = ROUTE;
  const ipMaterial = resolveClientIpMaterial(request.headers);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const userAgentHash = hmac(secret, userAgent);
  const identityHash = hmac(secret, `${route}:${ipMaterial}:${userAgentHash}`);

  return {
    ok: true,
    identity: {
      identityHash,
      userAgentHash,
    },
  };
}

export async function recordContactSpamAttempt(identity: SpamIdentity): Promise<void> {
  await insertContactSpamEvent({
    eventType: 'attempt',
    identity,
    attemptCount: null,
  });
}

export async function checkContactRateLimit(identity: SpamIdentity): Promise<RateLimitDecision> {
  const supabase = createSupabaseServiceRoleClient();
  const since = new Date(Date.now() - CONTACT_RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();

  const { count, error } = await supabase
    .from('contact_spam_events')
    .select('id', { count: 'exact', head: true })
    .eq('route', ROUTE)
    .eq('identity_hash', identity.identityHash)
    .eq('event_type', 'attempt')
    .gte('created_at', since);

  if (error) {
    throw new Error(`Contact spam rate limit count failed: ${error.message}`);
  }

  const attemptCount = count ?? 0;
  if (attemptCount > CONTACT_RATE_LIMIT_MAX_ATTEMPTS) {
    return { limited: true, attemptCount };
  }

  return { limited: false };
}

export async function recordContactRateLimitEvent(
  identity: SpamIdentity,
  attemptCount: number
): Promise<void> {
  await insertContactSpamEvent({
    eventType: 'rate_limit',
    identity,
    attemptCount,
  });
}

export async function recordContactHoneypotEvent(identity: SpamIdentity): Promise<void> {
  await insertContactSpamEvent({
    eventType: 'honeypot',
    identity,
    attemptCount: null,
  });
}

export function isContactHoneypotFilled(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const value = (body as Record<string, unknown>).website;
  return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
}

export function logContactSpamGuardWarning(reason: string) {
  console.warn(`Contact spam guard skipped: ${reason}`);
}

function resolveClientIpMaterial(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  const forwardedForFirst = forwardedFor?.split(',')[0]?.trim();
  if (forwardedForFirst) return forwardedForFirst;

  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  return 'unknown';
}

function hmac(secret: string, value: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

async function insertContactSpamEvent(input: {
  eventType: ContactSpamEventType;
  identity: SpamIdentity;
  attemptCount: number | null;
}): Promise<void> {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from('contact_spam_events').insert({
    event_type: input.eventType,
    route: ROUTE,
    identity_hash: input.identity.identityHash,
    user_agent_hash: input.identity.userAgentHash,
    attempt_count: input.attemptCount,
  });

  if (error) {
    throw new Error(`Contact spam event write failed: ${error.message}`);
  }
}
