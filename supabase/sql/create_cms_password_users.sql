-- CMS auth helper SQL
-- Run in Supabase SQL Editor (or psql as service role).
--
-- This file now has 2 modes:
-- A) Grant role to users that ALREADY exist in Supabase Auth (created from Dashboard).
-- B) Create/update password users + assign CMS roles.

-- ============================================================================
-- A) Grant CMS role for existing Dashboard users (recommended for your case)
-- ============================================================================
-- Replace emails/roles below. This will NOT create users; it only maps role.
-- Example: set one user to super_admin.
WITH desired_roles AS (
  SELECT *
  FROM (
    VALUES
      ('your-admin-email@example.com', 'super_admin')
  ) AS t(email, role_text)
)
INSERT INTO public.cms_user_roles (user_id, email, role)
SELECT
  au.id,
  lower(dr.email),
  dr.role_text::public.cms_role
FROM desired_roles dr
JOIN auth.users au
  ON lower(au.email) = lower(dr.email)
ON CONFLICT (user_id)
DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = now();

-- Optional: check which requested emails were not found in auth.users.
SELECT dr.email AS missing_email
FROM (
  VALUES
    ('your-admin-email@example.com')
) AS dr(email)
LEFT JOIN auth.users au ON lower(au.email) = lower(dr.email)
WHERE au.id IS NULL;

-- ============================================================================
-- B) Create/update password users + assign CMS roles (optional)
-- ============================================================================
-- Keep this block if you also want to provision test accounts without signup UI.
-- NOTE: Replace sample emails/passwords before running.
DO $$
DECLARE
  u RECORD;
  v_user_id UUID;
BEGIN
  FOR u IN
    SELECT *
    FROM (
      VALUES
        ('cms.superadmin@example.com', 'ChangeMe_SuperAdmin123!', 'super_admin'),
        ('cms.contentadmin@example.com', 'ChangeMe_ContentAdmin123!', 'content_admin'),
        ('cms.editor@example.com', 'ChangeMe_Editor123!', 'editor'),
        ('cms.viewer@example.com', 'ChangeMe_Viewer123!', 'viewer')
    ) AS t(email, pass, role_text)
  LOOP
    -- Create user when missing.
    IF NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.email = lower(u.email)) THEN
      BEGIN
        PERFORM auth.admin_create_user(lower(u.email), u.pass, TRUE);
      EXCEPTION
        WHEN undefined_function THEN
          RAISE EXCEPTION
            'auth.admin_create_user(...) not found. Enable/upgrade Supabase Auth SQL helpers, or create users in Dashboard > Authentication > Users.';
      END;
    ELSE
      -- Update password/email-confirmed for existing user.
      UPDATE auth.users
      SET
        encrypted_password = crypt(u.pass, gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
      WHERE email = lower(u.email);
    END IF;

    -- Ensure user row exists (after create/update).
    SELECT id INTO v_user_id FROM auth.users WHERE email = lower(u.email) LIMIT 1;
    IF v_user_id IS NULL THEN
      RAISE EXCEPTION 'Failed to resolve auth user for email=%', u.email;
    END IF;

    -- Assign CMS role for token hook claim app_metadata.cms_role.
    INSERT INTO public.cms_user_roles (user_id, email, role)
    VALUES (v_user_id, lower(u.email), u.role_text::public.cms_role)
    ON CONFLICT (user_id)
    DO UPDATE SET
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      updated_at = now();
  END LOOP;
END
$$;

-- Refresh token/session after role update so JWT includes app_metadata.cms_role.
-- For automated scripts, log out + log in again after running this query.
