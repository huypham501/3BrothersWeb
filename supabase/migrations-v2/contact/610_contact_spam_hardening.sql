-- Add Contact Phase 3 spam hardening storage and rate-limit copy.

UPDATE global_settings
SET
  content = COALESCE(content, '{}'::jsonb) || jsonb_build_object(
    'rate_limit_message',
    COALESCE(content->>'rate_limit_message', 'Không thể gửi thông tin lúc này. Vui lòng thử lại sau.')
  ),
  published_content = CASE
    WHEN published_content IS NULL THEN published_content
    ELSE published_content || jsonb_build_object(
      'rate_limit_message',
      COALESCE(published_content->>'rate_limit_message', 'Không thể gửi thông tin lúc này. Vui lòng thử lại sau.')
    )
  END
WHERE schema_key = 'global.contact_page.v1';

CREATE TABLE IF NOT EXISTS contact_spam_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('attempt', 'honeypot', 'rate_limit')),
  route TEXT NOT NULL CHECK (route = '/api/contact'),
  identity_hash TEXT NOT NULL,
  user_agent_hash TEXT,
  attempt_count INTEGER CHECK (attempt_count IS NULL OR attempt_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_spam_events_rate_window
ON contact_spam_events(identity_hash, route, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_spam_events_created_at
ON contact_spam_events(created_at DESC);

ALTER TABLE contact_spam_events ENABLE ROW LEVEL SECURITY;

-- 30-day retention cleanup query for scheduled maintenance:
-- DELETE FROM contact_spam_events
-- WHERE created_at < NOW() - INTERVAL '30 days';
