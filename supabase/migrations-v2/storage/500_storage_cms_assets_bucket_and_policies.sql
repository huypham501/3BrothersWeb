-- Create/update CMS assets bucket and required storage policies.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-assets',
  'cms-assets',
  true,
  3145728,
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/avif'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'cms_assets_public_select'
  ) THEN
    CREATE POLICY cms_assets_public_select
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'cms-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'cms_assets_authenticated_insert'
  ) THEN
    CREATE POLICY cms_assets_authenticated_insert
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'cms-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'cms_assets_authenticated_update'
  ) THEN
    CREATE POLICY cms_assets_authenticated_update
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'cms-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'cms_assets_authenticated_delete'
  ) THEN
    CREATE POLICY cms_assets_authenticated_delete
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'cms-assets');
  END IF;
END $$;
