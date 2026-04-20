-- ============================================================
-- Migration 007: CMS Assets Storage Bucket
-- Creates a public Supabase Storage bucket for CMS-managed
-- images, with RLS policies for authenticated admin access.
-- ============================================================

-- Create the cms-assets bucket
-- public = true means files are accessible via public URL without auth
-- file_size_limit = 3145728 bytes = 3 MB
-- allowed_mime_types restricts uploads to image formats only
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

-- ============================================================
-- RLS Policies for storage.objects
-- ============================================================

-- 1. Public read: anyone can view CMS assets (needed for website rendering)
CREATE POLICY "cms_assets_public_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cms-assets');

-- 2. Authenticated upload: only logged-in users can upload
--    Files are stored under images/<uuid>-<filename> path
CREATE POLICY "cms_assets_authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cms-assets');

-- 3. Authenticated update: allow overwriting/replacing files
CREATE POLICY "cms_assets_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cms-assets');

-- 4. Authenticated delete: allow deleting uploaded assets
CREATE POLICY "cms_assets_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cms-assets');
