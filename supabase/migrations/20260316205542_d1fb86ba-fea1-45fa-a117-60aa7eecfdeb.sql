CREATE TABLE public.terms_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  service text,
  ip_address text,
  accepted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert terms acceptance"
  ON public.terms_acceptances
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view terms acceptances"
  ON public.terms_acceptances
  FOR SELECT
  TO public
  USING (public.has_role(auth.uid(), 'admin'::app_role));