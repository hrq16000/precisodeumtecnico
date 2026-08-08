-- Harden: remove execute from anon/public on internal functions
REVOKE ALL ON FUNCTION public.update_leads_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_reviews_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_service_orders_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.validate_lead_min_visit() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;

-- Tighten public lookups (still SECURITY DEFINER, non-PII columns only)
CREATE OR REPLACE FUNCTION public.get_service_order_status(_protocol text)
RETURNS TABLE(protocol text, service text, equipment text, city text, neighborhood text, status text, public_note text, eta_date date, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT o.protocol, o.service, o.equipment, o.city, o.neighborhood,
         o.status, o.public_note, o.eta_date, o.created_at, o.updated_at
  FROM public.service_orders o
  WHERE length(btrim(coalesce(_protocol,''))) BETWEEN 6 AND 40
    AND upper(btrim(o.protocol)) = upper(btrim(_protocol))
  LIMIT 1
$function$;

CREATE OR REPLACE FUNCTION public.get_service_orders_by_phone(_phone text)
RETURNS TABLE(protocol text, service text, equipment text, city text, neighborhood text, status text, public_note text, eta_date date, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT o.protocol, o.service, o.equipment, o.city, o.neighborhood,
         o.status, o.public_note, o.eta_date, o.created_at, o.updated_at
  FROM public.service_orders o
  WHERE length(regexp_replace(coalesce(_phone,''), '\D', '', 'g')) BETWEEN 10 AND 11
    AND right(regexp_replace(coalesce(o.customer_phone,''), '\D', '', 'g'), 11)
        = right(regexp_replace(_phone, '\D', '', 'g'), 11)
  ORDER BY o.updated_at DESC
  LIMIT 5
$function$;

REVOKE ALL ON FUNCTION public.get_service_order_status(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_service_orders_by_phone(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_service_order_status(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_service_orders_by_phone(text) TO anon, authenticated;