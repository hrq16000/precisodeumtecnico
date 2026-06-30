
CREATE OR REPLACE FUNCTION public.validate_lead_min_visit()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.service_mode = 'visit'
     AND NEW.estimated_ticket_min IS NOT NULL
     AND NEW.estimated_ticket_min < 99 THEN
    RAISE EXCEPTION 'lead_min_visit_violation: visita técnica exige valor mínimo de R$ 99,99 (estimated_ticket_min=%).', NEW.estimated_ticket_min;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_lead_min_visit ON public.leads;
CREATE TRIGGER trg_validate_lead_min_visit
BEFORE INSERT OR UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.validate_lead_min_visit();
