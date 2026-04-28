-- Migration: 010_blog_cover_aspect_ratio.sql
-- Description: Add draft/published cover aspect ratio columns for blog hero rendering.

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS cover_aspect_ratio TEXT,
  ADD COLUMN IF NOT EXISTS published_cover_aspect_ratio TEXT;

