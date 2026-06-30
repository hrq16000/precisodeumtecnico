-- Enable scheduling extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Track upload failures (invalid_session, invalid_token, etc.) for alerting
CREATE TABLE IF NOT EXISTS public.triage_media_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reason text NOT NULL,
  session_id text,
  ip_address text,
  user_agent text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.triage_media_failures TO authenticated;
GRANT ALL ON public.triage_media_failures TO service_role;

ALTER TABLE public.triage_media_failures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read triage failures" ON public.triage_media_failures;
CREATE POLICY "Admins can read triage failures"
  ON public.triage_media_failures
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS triage_media_failures_created_at_idx
  ON public.triage_media_failures (created_at DESC);
CREATE INDEX IF NOT EXISTS triage_media_failures_reason_idx
  ON public.triage_media_failures (reason, created_at DESC);

-- Tracks the last time an alert was dispatched to avoid spamming admins
CREATE TABLE IF NOT EXISTS public.triage_alert_state (
  id text PRIMARY KEY,
  last_alert_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.triage_alert_state TO service_role;
ALTER TABLE public.triage_alert_state ENABLE ROW LEVEL SECURITY;
-- (no policies: service_role only)

-- Schedule cleanup: every hour, delete triage media older than 48h
SELECT cron.unschedule('triage-media-cleanup-hourly')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'triage-media-cleanup-hourly');

SELECT cron.schedule(
  'triage-media-cleanup-hourly',
  '15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://fqqufspxwujutthpjymh.supabase.co/functions/v1/triage-media-cleanup',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxcXVmc3B4d3VqdXR0aHBqeW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDA5NjcsImV4cCI6MjA4MDM3Njk2N30.9hz5oXC2w9nJ5k3_BJ_xH4IuEkdDTUbqv2Cn9Ggi-Sg"}'::jsonb,
    body := jsonb_build_object('triggered_at', now())
  );
  $$
);

-- Schedule alerts: every 10 min, check for spike of upload failures
SELECT cron.unschedule('triage-media-alerts-10min')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'triage-media-alerts-10min');

SELECT cron.schedule(
  'triage-media-alerts-10min',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://fqqufspxwujutthpjymh.supabase.co/functions/v1/triage-media-alerts',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxcXVmc3B4d3VqdXR0aHBqeW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDA5NjcsImV4cCI6MjA4MDM3Njk2N30.9hz5oXC2w9nJ5k3_BJ_xH4IuEkdDTUbqv2Cn9Ggi-Sg"}'::jsonb,
    body := jsonb_build_object('triggered_at', now())
  );
  $$
);