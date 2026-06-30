CREATE TABLE public.triage_media_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  object_path text NOT NULL UNIQUE,
  mime_type text,
  size_bytes bigint,
  ip_address text,
  user_agent text,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX triage_media_uploads_session_idx ON public.triage_media_uploads (session_id);
CREATE INDEX triage_media_uploads_created_at_idx ON public.triage_media_uploads (created_at DESC);
CREATE INDEX triage_media_uploads_lead_id_idx ON public.triage_media_uploads (lead_id);

GRANT SELECT ON public.triage_media_uploads TO authenticated;
GRANT ALL ON public.triage_media_uploads TO service_role;

ALTER TABLE public.triage_media_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read triage media audit log"
  ON public.triage_media_uploads
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- No INSERT/UPDATE/DELETE policies: writes only via service_role (edge function).
COMMENT ON TABLE public.triage_media_uploads IS
  'Audit log of files uploaded via the triage-media-upload edge function. Writes are server-only.';