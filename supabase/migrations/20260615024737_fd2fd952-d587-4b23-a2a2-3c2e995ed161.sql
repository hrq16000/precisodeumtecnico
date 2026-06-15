-- Storage policies for the private bucket "triage-media".
-- Path convention (enforced client-side and validated here):
--   triage-media/<session-uuid>/<filename>
-- where <session-uuid> is a uuid generated in the browser and persisted
-- in the lead row (triage_payload.session_id). The first path segment is
-- treated as an opaque token: anyone who knows it can write to that folder
-- only. Reads/updates/deletes are restricted to admins.

-- Anyone (anon or authenticated) may upload to triage-media, as long as
-- the object key has at least one folder segment (the session token).
CREATE POLICY "triage_media_public_insert"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'triage-media'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND length((storage.foldername(name))[1]) BETWEEN 8 AND 64
);

-- Only admins can list/read uploaded media.
CREATE POLICY "triage_media_admin_select"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'triage-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Only admins can update or delete.
CREATE POLICY "triage_media_admin_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'triage-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'triage-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "triage_media_admin_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'triage-media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);