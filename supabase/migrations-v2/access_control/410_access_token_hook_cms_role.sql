-- Attach CMS role to Supabase access token claims using a Postgres auth hook.
-- Hook type: Custom Access Token (JWT) Claims
-- Function signature required by Supabase Auth: (event jsonb) -> jsonb

CREATE OR REPLACE FUNCTION public.cms_custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  claims jsonb;
  app_meta jsonb;
  role_value public.cms_role;
  user_uuid uuid;
BEGIN
  claims := COALESCE(event->'claims', '{}'::jsonb);
  app_meta := COALESCE(claims->'app_metadata', '{}'::jsonb);
  user_uuid := NULLIF(event->>'user_id', '')::uuid;

  IF user_uuid IS NOT NULL THEN
    SELECT role
    INTO role_value
    FROM public.cms_user_roles
    WHERE user_id = user_uuid
    LIMIT 1;
  END IF;

  -- Policy: missing role row => no cms_role claim (deny-by-default in app layer).
  IF role_value IS NULL THEN
    app_meta := app_meta - 'cms_role';
  ELSE
    app_meta := jsonb_set(app_meta, '{cms_role}', to_jsonb(role_value::text), true);
  END IF;

  claims := jsonb_set(claims, '{app_metadata}', app_meta, true);
  event := jsonb_set(event, '{claims}', claims, true);

  RETURN event;
END;
$$;

COMMENT ON FUNCTION public.cms_custom_access_token_hook(jsonb)
IS 'Supabase custom access token hook that injects app_metadata.cms_role from public.cms_user_roles.';

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.cms_custom_access_token_hook(jsonb) TO supabase_auth_admin;

REVOKE EXECUTE ON FUNCTION public.cms_custom_access_token_hook(jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cms_custom_access_token_hook(jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.cms_custom_access_token_hook(jsonb) FROM authenticated;
