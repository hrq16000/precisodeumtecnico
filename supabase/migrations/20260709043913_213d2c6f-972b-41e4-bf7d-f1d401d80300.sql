CREATE OR REPLACE FUNCTION public.validate_lead_min_visit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.service_mode IN ('visit','visita','bancada','diagnostico','bench') THEN
    IF COALESCE(NEW.estimated_ticket_min, 0) < 99.99 THEN
      NEW.estimated_ticket_min := 99.99;
    END IF;
  ELSIF NEW.service_mode IN ('coleta','coleta-entrega','pickup','delivery') THEN
    IF COALESCE(NEW.estimated_ticket_min, 0) < 299.99 THEN
      NEW.estimated_ticket_min := 299.99;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_validate_lead_min_visit ON public.leads;
CREATE TRIGGER trg_validate_lead_min_visit
BEFORE INSERT OR UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.validate_lead_min_visit();