CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  city text,
  neighborhood text,
  service text,
  protocol text,
  rating smallint NOT NULL,
  comment text,
  publish_consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  source text,
  page_path text,
  user_agent text,
  moderated_at timestamptz,
  moderated_by uuid
);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a review"
ON public.reviews FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 2 AND 120
  AND rating BETWEEN 1 AND 5
  AND (comment IS NULL OR length(comment) <= 1200)
  AND (city IS NULL OR length(city) <= 120)
  AND (neighborhood IS NULL OR length(neighborhood) <= 120)
  AND (service IS NULL OR length(service) <= 200)
  AND (protocol IS NULL OR length(protocol) <= 40)
  AND (source IS NULL OR length(source) <= 64)
  AND (page_path IS NULL OR length(page_path) <= 2048)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
  AND status = 'pending'
  AND moderated_at IS NULL
  AND moderated_by IS NULL
);

CREATE POLICY "Public can read approved published reviews"
ON public.reviews FOR SELECT TO anon, authenticated
USING (status = 'approved' AND publish_consent = true);

CREATE POLICY "Admins can read all reviews"
ON public.reviews FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can moderate reviews"
ON public.reviews FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_reviews_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_reviews_updated_at();

CREATE INDEX idx_reviews_status_created ON public.reviews (status, created_at DESC);