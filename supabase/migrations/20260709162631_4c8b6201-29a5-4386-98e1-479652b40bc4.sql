-- Substitui a policy `WITH CHECK (true)` por restrições concretas alinhadas
-- ao payload real do cliente (src/lib/waAudit.ts). Mantém o comportamento
-- (log anônimo de cliques WhatsApp) sem permitir payload arbitrário.
DROP POLICY IF EXISTS "anyone can insert audit event" ON public.wa_bypass_events;

CREATE POLICY "anyone can insert wa audit event"
  ON public.wa_bypass_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    kind IN ('whatsapp', 'phone')
    AND (source IS NULL OR length(source) <= 120)
    AND (href IS NULL OR length(href) <= 2048)
    AND (category IS NULL OR length(category) <= 80)
    AND (page_path IS NULL OR length(page_path) <= 2048)
    AND (user_agent IS NULL OR length(user_agent) <= 500)
    AND (session_id IS NULL OR length(session_id) <= 128)
  );