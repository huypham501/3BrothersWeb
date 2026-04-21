# Access Token Hook Runbook (CMS Role Claim)

This runbook wires Supabase Auth to use the Postgres hook function:
`public.cms_custom_access_token_hook(event jsonb)`.

## 1) Apply migration

Run your normal migration flow so function + grants are created:

- `supabase/migrations-v2/access_control/410_access_token_hook_cms_role.sql`

## 2) Configure Supabase Auth Hook

In Supabase Dashboard:

1. Open `Authentication` -> `Hooks`.
2. Find `Custom Access Token (JWT) Claims`.
3. Choose `Postgres function`.
4. Select function: `public.cms_custom_access_token_hook`.
5. Save.

## 3) Verify role claim in JWT

After sign-in (or token refresh), decode access token payload and verify:

- `app_metadata.cms_role` exists for users in `cms_user_roles`.
- claim values are one of:
  - `super_admin`
  - `content_admin`
  - `editor`
  - `viewer`

If user has no row in `cms_user_roles`, `app_metadata.cms_role` should be absent.

## 4) App behavior expectations

- Missing/invalid `app_metadata.cms_role` -> admin access is denied by app helpers.
- Capability checks (`view`, `edit_draft`, `publish`, etc.) are enforced by app helper logic.
