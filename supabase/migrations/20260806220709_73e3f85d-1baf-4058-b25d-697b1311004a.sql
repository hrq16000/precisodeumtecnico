CREATE OR REPLACE FUNCTION public.get_service_orders_by_phone(_phone text)
RETURNS TABLE(protocol text, service text, equipment text, city text, neighborhood text, status text, public_note text, eta_date date, created_at timestamptz, updated_at timestamptz)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT o.protocol, o.service, o.equipment, o.city, o.neighborhood,
         o.status, o.public_note, o.eta_date, o.created_at, o.updated_at
  FROM public.service_orders o
  WHERE length(regexp_replace(coalesce(_phone,''), '\D', '', 'g')) >= 10
    AND right(regexp_replace(coalesce(o.customer_phone,''), '\D', '', 'g'), 11)
        = right(regexp_replace(_phone, '\D', '', 'g'), 11)
  ORDER BY o.updated_at DESC
  LIMIT 5
$$;

GRANT EXECUTE ON FUNCTION public.get_service_orders_by_phone(text) TO anon, authenticated;