
CREATE OR REPLACE FUNCTION public.validate_lead_min_visit()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.service_mode IN ('visit','visita')
     AND COALESCE(NEW.estimated_ticket_min, 0) < 99 THEN
    -- força piso de R$ 99 quando o cliente esqueceu de informar.
    NEW.estimated_ticket_min := 99;
  END IF;
  RETURN NEW;
END;
$$;
