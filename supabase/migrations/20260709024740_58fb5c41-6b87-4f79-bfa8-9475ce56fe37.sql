
CREATE TABLE public.wa_bypass_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT,
  href TEXT,
  kind TEXT NOT NULL DEFAULT 'whatsapp',
  category TEXT,
  bypass BOOLEAN NOT NULL DEFAULT false,
  page_path TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.wa_bypass_events TO authenticated;
GRANT INSERT ON public.wa_bypass_events TO anon, authenticated;
GRANT ALL ON public.wa_bypass_events TO service_role;

ALTER TABLE public.wa_bypass_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can insert audit event"
  ON public.wa_bypass_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins read audit events"
  ON public.wa_bypass_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_wa_bypass_created ON public.wa_bypass_events (created_at DESC);
CREATE INDEX idx_wa_bypass_bypass ON public.wa_bypass_events (bypass, created_at DESC);
CREATE INDEX idx_wa_bypass_source ON public.wa_bypass_events (source);
