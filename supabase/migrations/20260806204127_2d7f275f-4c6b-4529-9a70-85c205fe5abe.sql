CREATE TABLE public.service_orders (
  id uuid primary key default gen_random_uuid(),
  protocol text not null unique,
  customer_name text,
  customer_phone text,
  city text,
  neighborhood text,
  service text,
  equipment text,
  status text not null default 'recebido',
  public_note text,
  eta_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_orders TO authenticated;
GRANT ALL ON public.service_orders TO service_role;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage service orders" ON public.service_orders
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_service_orders_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders
FOR EACH ROW EXECUTE FUNCTION public.update_service_orders_updated_at();

-- Consulta pública por protocolo: retorna apenas dados não sensíveis.
CREATE OR REPLACE FUNCTION public.get_service_order_status(_protocol text)
RETURNS TABLE (
  protocol text,
  service text,
  equipment text,
  city text,
  neighborhood text,
  status text,
  public_note text,
  eta_date date,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT o.protocol, o.service, o.equipment, o.city, o.neighborhood,
         o.status, o.public_note, o.eta_date, o.created_at, o.updated_at
  FROM public.service_orders o
  WHERE upper(btrim(o.protocol)) = upper(btrim(_protocol))
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_service_order_status(text) TO anon, authenticated;

CREATE TABLE public.data_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  protocol text,
  scope text not null default 'todos',
  details text,
  status text not null default 'pending',
  page_path text,
  user_agent text,
  handled_at timestamptz,
  handled_by uuid,
  created_at timestamptz not null default now()
);

GRANT INSERT ON public.data_deletion_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.data_deletion_requests TO authenticated;
GRANT ALL ON public.data_deletion_requests TO service_role;
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request data deletion" ON public.data_deletion_requests
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(name)) between 2 and 200
  AND length(btrim(phone)) between 5 and 50
  AND (email IS NULL OR (length(email) between 3 and 320 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
  AND (protocol IS NULL OR length(protocol) <= 40)
  AND scope IN ('todos','anexos','avaliacao')
  AND (details IS NULL OR length(details) <= 2000)
  AND status = 'pending'
  AND handled_at IS NULL AND handled_by IS NULL
  AND (page_path IS NULL OR length(page_path) <= 2048)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
);

CREATE POLICY "Admins read deletion requests" ON public.data_deletion_requests
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update deletion requests" ON public.data_deletion_requests
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));