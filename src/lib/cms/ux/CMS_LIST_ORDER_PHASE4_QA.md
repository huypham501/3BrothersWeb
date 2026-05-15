# CMS List Order - Phase 4 QA & Guardrail

## QA Checklist
- TypeScript check passes: `./node_modules/.bin/tsc --noEmit`
- CMS list-order guardrail passes: `node scripts/cms-list-order-guardrail.mjs`
- CMS UI boundary guardrail passes: `node scripts/cms-ui-boundary-check.mjs`

## Guardrail Added
- Script: `scripts/cms-list-order-guardrail.mjs`
- Purpose:
  - enforce `required` list rules have reorder markers
  - enforce `forbidden` list rules do not have reorder markers
- Policy source: `src/lib/cms/ux/list-order-policy.ts`

## CI/Verification Integration
- Added npm script: `cms:check:list-order`
- Added to phase verification chain:
  - `cms:verify:phase7` now runs:
    1. `cms:check:ui-boundary`
    2. `cms:check:list-order`
    3. `cms-phase7-verify.mjs`
