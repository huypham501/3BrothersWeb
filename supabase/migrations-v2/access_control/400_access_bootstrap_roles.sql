-- Bootstrap existing authenticated users as super_admin.

INSERT INTO cms_user_roles (user_id, email, role)
SELECT id, email, 'super_admin'::cms_role
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
