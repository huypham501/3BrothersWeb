# Naming and Folder Convention

## Folder Blocks
- `_core`: `010-099`
- `pages`: `100-199`
- `sections`: `200-299`
- `settings`: `300-399`
- `access_control`: `400-499`
- `storage`: `500-599`
- `domains/*`: `600+`

## File Name Pattern
`NNN_<scope>_<intent>.sql`

Examples:
- `010_cms_types_and_functions.sql`
- `020_cms_schema_base.sql`
- `100_pages_seed_home.sql`
- `500_storage_cms_assets_bucket_and_policies.sql`

## Intent Rules
- `types_and_functions`: enum and shared SQL functions.
- `schema_base`: canonical `CREATE TABLE` and core indexes/triggers.
- `seed_*`: deterministic seed payloads grouped by responsibility.
- `*_policies`: access/policy logic.

## Guardrails
- Keep object names exactly as runtime expects.
- Do not rename/drop legacy objects in refactor steps.
- Keep seed conflict policy aligned with existing behavior.
- Avoid placeholder SQL files. Add new SQL only when query logic exists.
