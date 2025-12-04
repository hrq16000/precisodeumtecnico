-- Remove the overly permissive policy that allows any authenticated user to view all leads
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;