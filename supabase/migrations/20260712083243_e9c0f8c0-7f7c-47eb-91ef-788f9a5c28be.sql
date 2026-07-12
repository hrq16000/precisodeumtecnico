
DROP POLICY "Anyone can insert leads" ON public.leads;

ALTER TABLE public.leads
  ALTER COLUMN estimated_ticket_min TYPE numeric(10,2) USING estimated_ticket_min::numeric,
  ALTER COLUMN estimated_ticket_max TYPE numeric(10,2) USING estimated_ticket_max::numeric;

CREATE POLICY "Anyone can insert leads" ON public.leads
FOR INSERT
WITH CHECK (
  (length(btrim(name)) >= 1) AND (length(btrim(name)) <= 200)
  AND (length(btrim(email)) >= 3) AND (length(btrim(email)) <= 320)
  AND (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  AND (length(btrim(phone)) >= 5) AND (length(btrim(phone)) <= 50)
  AND ((service IS NULL) OR (length(service) <= 200))
  AND ((message IS NULL) OR (length(message) <= 5000))
  AND ((city IS NULL) OR (length(city) <= 120))
  AND ((neighborhood IS NULL) OR (length(neighborhood) <= 120))
  AND (status = 'new')
  AND ((category IS NULL) OR (length(category) <= 64))
  AND ((brand IS NULL) OR (length(brand) <= 80))
  AND ((model IS NULL) OR (length(model) <= 120))
  AND ((symptom IS NULL) OR (length(symptom) <= 200))
  AND ((symptom_slug IS NULL) OR (length(symptom_slug) <= 120))
  AND ((service_mode IS NULL) OR (service_mode = ANY (ARRAY['bancada','visita','coleta'])))
  AND ((estimated_ticket_min IS NULL) OR ((estimated_ticket_min >= 0) AND (estimated_ticket_min <= 100000)))
  AND ((estimated_ticket_max IS NULL) OR ((estimated_ticket_max >= 0) AND (estimated_ticket_max <= 100000)))
  AND ((sla_days_min IS NULL) OR ((sla_days_min >= 0) AND (sla_days_min <= 365)))
  AND ((sla_days_max IS NULL) OR ((sla_days_max >= 0) AND (sla_days_max <= 365)))
  AND ((media_urls IS NULL) OR (array_length(media_urls, 1) IS NULL) OR (array_length(media_urls, 1) <= 10))
  AND ((source IS NULL) OR (length(source) <= 64))
  AND ((user_agent IS NULL) OR (length(user_agent) <= 500))
  AND ((referrer IS NULL) OR (length(referrer) <= 1000))
);
