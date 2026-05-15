# CMS List Order Audit - Phase 1

## Scope
- Reviewed CMS schema list fields, admin editors, resolver usage, and public rendering order.
- Goal: identify exactly which lists must support index change UX and which must stay fixed.

## Decision Model
- `required`: must provide reorder UX (index change).
- `forbidden`: must not provide reorder UX (fixed semantic slots).

## Inventory Summary
- Total list targets in scope: `20`
- `required`: `15`
- `forbidden`: `5`

## Required Reorder Targets (15)
1. `global_header.nav_links`
2. `global_footer.menu_links`
3. `global_footer.social_links`
4. `home_partners.partners`
5. `home_core_competencies.services`
6. `home_efficiency.stats`
7. `home_trending.selected_post_ids`
8. `for_creators_testimonials.testimonials`
9. `shared_exclusive_talents.talents`
10. `job_position.descriptions`
11. `job_position.requirements`
12. `job_position.benefits`
13. `blog_post.content`
14. `blog_post.mid_content`
15. `careers.job_positions_sort_order`

## Forbidden Reorder Targets (5)
1. `for_creators_benefit.benefits`
2. `social_commerce_hero.services`
3. `social_commerce_social_proof.items`
4. `social_commerce_growth.stats`
5. `social_commerce_value_proposition.items`

## Current Inconsistency Snapshot
- Already has reorder UX:
  - `blog_post.content`, `blog_post.mid_content`
  - `job_position.descriptions|requirements|benefits`
  - `home_trending.selected_post_ids` (custom non-Antd pattern)
- Missing reorder UX but should have:
  - `global_header.nav_links`
  - `global_footer.menu_links`, `global_footer.social_links`
  - `home_partners.partners`
  - `home_core_competencies.services`
  - `home_efficiency.stats`
  - `for_creators_testimonials.testimonials`
  - `shared_exclusive_talents.talents`
  - `careers.job_positions_sort_order`

## Output of Phase 1
- Source of truth added at:
  - `src/lib/cms/ux/list-order-policy.ts`
- This file defines:
  - list IDs
  - reorder policy (`required|forbidden`)
  - rationale per list
  - helper for summary and lookup

## Phase 2 Baseline Component
- Shared Antd reorder UI component:
  - `src/components/admin/cms/ux/CmsSortableList.tsx`
- Includes:
  - drag handle visual (`DragOutlined`) for standardized affordance
  - up/down fallback controls
  - optional add/remove controls
