-- Fase A: adicionar campos de triagem na tabela leads
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS symptom text,
  ADD COLUMN IF NOT EXISTS symptom_slug text,
  ADD COLUMN IF NOT EXISTS service_mode text,
  ADD COLUMN IF NOT EXISTS estimated_ticket_min integer,
  ADD COLUMN IF NOT EXISTS estimated_ticket_max integer,
  ADD COLUMN IF NOT EXISTS sla_days_min integer,
  ADD COLUMN IF NOT EXISTS sla_days_max integer,
  ADD COLUMN IF NOT EXISTS media_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS triage_payload jsonb,
  ADD COLUMN IF NOT EXISTS triage_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS terms_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS user_agent text,
  ADD COLUMN IF NOT EXISTS referrer text;

-- Índices úteis para o /admin (Fase C)
CREATE INDEX IF NOT EXISTS leads_category_idx ON public.leads (category);
CREATE INDEX IF NOT EXISTS leads_service_mode_idx ON public.leads (service_mode);
CREATE INDEX IF NOT EXISTS leads_symptom_slug_idx ON public.leads (symptom_slug);
CREATE INDEX IF NOT EXISTS leads_triage_completed_idx ON public.leads (triage_completed);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

-- Reforça a policy de INSERT pública para validar também os novos campos.
-- Mantém a regra atual: status = 'new', e-mail válido, limites de tamanho.
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name))  BETWEEN 1 AND 200
  AND length(btrim(email)) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(phone)) BETWEEN 5 AND 50
  AND (service  IS NULL OR length(service)  <= 200)
  AND (message  IS NULL OR length(message)  <= 5000)
  AND (city     IS NULL OR length(city)     <= 120)
  AND (neighborhood IS NULL OR length(neighborhood) <= 120)
  AND status = 'new'
  -- novos campos
  AND (category      IS NULL OR length(category)      <= 64)
  AND (brand         IS NULL OR length(brand)         <= 80)
  AND (model         IS NULL OR length(model)         <= 120)
  AND (symptom       IS NULL OR length(symptom)       <= 200)
  AND (symptom_slug  IS NULL OR length(symptom_slug)  <= 120)
  AND (service_mode  IS NULL OR service_mode IN ('bancada','visita','coleta'))
  AND (estimated_ticket_min IS NULL OR (estimated_ticket_min >= 0 AND estimated_ticket_min <= 100000))
  AND (estimated_ticket_max IS NULL OR (estimated_ticket_max >= 0 AND estimated_ticket_max <= 100000))
  AND (sla_days_min IS NULL OR (sla_days_min >= 0 AND sla_days_min <= 365))
  AND (sla_days_max IS NULL OR (sla_days_max >= 0 AND sla_days_max <= 365))
  AND array_length(media_urls, 1) IS NULL OR array_length(media_urls, 1) <= 10
  AND (source     IS NULL OR length(source)     <= 64)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
  AND (referrer   IS NULL OR length(referrer)   <= 1000)
);