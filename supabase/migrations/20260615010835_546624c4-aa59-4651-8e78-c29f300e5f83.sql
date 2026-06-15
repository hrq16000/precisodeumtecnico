
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND length(btrim(email)) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(phone)) BETWEEN 5 AND 50
  AND (service IS NULL OR length(service) <= 200)
  AND (message IS NULL OR length(message) <= 5000)
  AND (city IS NULL OR length(city) <= 120)
  AND (neighborhood IS NULL OR length(neighborhood) <= 120)
  AND status = 'new'
);

DROP POLICY IF EXISTS "Anyone can insert terms acceptance" ON public.terms_acceptances;
CREATE POLICY "Anyone can insert terms acceptance"
ON public.terms_acceptances
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND length(btrim(phone)) BETWEEN 5 AND 50
  AND (email IS NULL OR (length(email) BETWEEN 3 AND 320 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
  AND (service IS NULL OR length(service) <= 200)
  AND (ip_address IS NULL OR length(ip_address) <= 64)
);
