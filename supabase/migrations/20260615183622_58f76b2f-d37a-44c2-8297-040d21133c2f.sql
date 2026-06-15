-- 1) FECHA bypass da OR em leads.INSERT
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
  AND (service       IS NULL OR length(service)       <= 200)
  AND (message       IS NULL OR length(message)       <= 5000)
  AND (city          IS NULL OR length(city)          <= 120)
  AND (neighborhood  IS NULL OR length(neighborhood)  <= 120)
  AND status = 'new'
  AND (category      IS NULL OR length(category)      <= 64)
  AND (brand         IS NULL OR length(brand)         <= 80)
  AND (model         IS NULL OR length(model)         <= 120)
  AND (symptom       IS NULL OR length(symptom)       <= 200)
  AND (symptom_slug  IS NULL OR length(symptom_slug)  <= 120)
  AND (service_mode  IS NULL OR service_mode = ANY (ARRAY['bancada','visita','coleta']))
  AND (estimated_ticket_min IS NULL OR (estimated_ticket_min BETWEEN 0 AND 100000))
  AND (estimated_ticket_max IS NULL OR (estimated_ticket_max BETWEEN 0 AND 100000))
  AND (sla_days_min  IS NULL OR (sla_days_min BETWEEN 0 AND 365))
  AND (sla_days_max  IS NULL OR (sla_days_max BETWEEN 0 AND 365))
  AND (media_urls IS NULL OR array_length(media_urls, 1) IS NULL OR array_length(media_urls, 1) <= 10)
  AND (source        IS NULL OR length(source)        <= 64)
  AND (user_agent    IS NULL OR length(user_agent)    <= 500)
  AND (referrer      IS NULL OR length(referrer)      <= 1000)
);

-- 2) STORAGE policies para bucket privado triage-media
-- Limpa policies antigas se existirem
DROP POLICY IF EXISTS "Anon can upload triage media in own session" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read triage media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage triage media" ON storage.objects;

-- Anon/auth pode SOMENTE inserir dentro de uma "pasta" (sessionId) plausível.
-- Path esperado: <sessionId>/<uuid>-<nome>. Primeira folder >= 8 chars.
CREATE POLICY "Anon can upload triage media in own session"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'triage-media'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND length((storage.foldername(name))[1]) BETWEEN 8 AND 64
);

-- Admins (has_role) podem ler, atualizar e deletar para gestão no /admin
CREATE POLICY "Admins can read triage media"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'triage-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can manage triage media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'triage-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);