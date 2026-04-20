# Supabase Migrations v2

This folder contains the canonical, scalable SQL layout for CMS schema management.

## Compatibility Contract
- `supabase/migrations` remains unchanged and is treated as legacy history.
- `supabase/migrations-v2` reorganizes the same query logic for maintainability.
- Refactor scope is SQL organization only. No breaking rename/drop of existing runtime objects.

## Design Principles
- Domain-first folder structure.
- Stable block numbering per concern.
- Keep SQL behavior aligned with currently applied schema flow.
- Prefer idempotent guards (`IF NOT EXISTS`, `ON CONFLICT`) where applicable.

## Execution Order (logical)
1. `_core/010_cms_types_and_functions.sql`
2. `_core/020_cms_schema_base.sql`
3. `settings/300_settings_seed_global_header_footer.sql`
4. `sections/200_sections_seed_shared.sql`
5. `pages/100_pages_seed_home.sql`
6. `pages/110_pages_seed_for_creators.sql`
7. `settings/310_settings_seed_metadata_defaults.sql`
8. `access_control/400_access_bootstrap_roles.sql`
9. `storage/500_storage_cms_assets_bucket_and_policies.sql`

## Mapping from Legacy Files
- `001_cms_tables.sql` -> `_core/010`, `_core/020`
- `003_cms_publish_flow.sql` -> merged into `_core/020` table definitions
- `006_cms_access_control_and_audit.sql` -> `_core/010`, `_core/020`, `access_control/400`
- `002_cms_seed.sql` -> `settings/300`, `sections/200`, `pages/100`
- `004_for_creators_cms_seed.sql` -> `pages/110`
- `005_global_metadata_defaults_seed.sql` -> `settings/310`
- `007_cms_storage_assets.sql` -> `storage/500`
