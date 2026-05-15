export type CmsListOrderPolicy = 'required' | 'optional' | 'forbidden';

export interface CmsListOrderRule {
  id: string;
  formId: string;
  fieldPath: string;
  policy: CmsListOrderPolicy;
  reason: string;
  editorPath: string;
}

/**
 * Phase 1 source-of-truth:
 * - required: must support reorder controls in CMS editor
 * - forbidden: must not expose reorder controls (fixed semantic slots/IDs)
 * - optional: order can be useful, but not mandatory at this phase
 */
export const CMS_LIST_ORDER_RULES: CmsListOrderRule[] = [
  {
    id: 'global_header.nav_links',
    formId: 'global_header',
    fieldPath: 'nav_links',
    policy: 'required',
    reason: 'Header nav is rendered in array order on public UI.',
    editorPath: 'src/components/admin/cms/global-settings/GlobalHeaderEditor.tsx',
  },
  {
    id: 'global_footer.menu_links',
    formId: 'global_footer',
    fieldPath: 'menu_links',
    policy: 'required',
    reason: 'Footer menu links are rendered in array order.',
    editorPath: 'src/components/admin/cms/global-settings/GlobalFooterEditor.tsx',
  },
  {
    id: 'global_footer.social_links',
    formId: 'global_footer',
    fieldPath: 'social_links',
    policy: 'required',
    reason: 'Footer social links are rendered in array order.',
    editorPath: 'src/components/admin/cms/global-settings/GlobalFooterEditor.tsx',
  },
  {
    id: 'home_partners.partners',
    formId: 'home_partners',
    fieldPath: 'partners',
    policy: 'required',
    reason: 'Partners are mapped in sequence for desktop/mobile tracks.',
    editorPath: 'src/components/admin/cms/editors/HomePartnersEditor.tsx',
  },
  {
    id: 'home_core_competencies.services',
    formId: 'home_core_competencies',
    fieldPath: 'services',
    policy: 'required',
    reason: 'Service cards are rendered in list order.',
    editorPath: 'src/components/admin/cms/editors/HomeCoreCompetenciesEditor.tsx',
  },
  {
    id: 'home_efficiency.stats',
    formId: 'home_efficiency',
    fieldPath: 'stats',
    policy: 'required',
    reason: 'Stats cards are displayed in list order.',
    editorPath: 'src/components/admin/cms/editors/HomeEfficiencyEditor.tsx',
  },
  {
    id: 'home_trending.selected_post_ids',
    formId: 'home_trending',
    fieldPath: 'selected_post_ids',
    policy: 'required',
    reason: 'Resolver preserves selected_post_ids order for public trending cards.',
    editorPath: 'src/components/admin/cms/editors/HomeTrendingEditor.tsx',
  },
  {
    id: 'for_creators_testimonials.testimonials',
    formId: 'for_creators_testimonials',
    fieldPath: 'testimonials',
    policy: 'required',
    reason: 'Testimonials are rendered in sequence on the page.',
    editorPath: 'src/components/admin/cms/editors/ForCreatorsTestimonialsEditor.tsx',
  },
  {
    id: 'shared_exclusive_talents.talents',
    formId: 'shared_exclusive_talents',
    fieldPath: 'talents',
    policy: 'required',
    reason: 'Talent slider/list position is order-sensitive and shared across pages.',
    editorPath: 'src/components/admin/cms/editors/SharedExclusiveTalentsEditor.tsx',
  },
  {
    id: 'job_position.descriptions',
    formId: 'job_position',
    fieldPath: 'descriptions',
    policy: 'required',
    reason: 'Paragraph flow is user-facing and order-sensitive.',
    editorPath: 'src/components/admin/cms/editors/JobPositionEditor.tsx',
  },
  {
    id: 'job_position.requirements',
    formId: 'job_position',
    fieldPath: 'requirements',
    policy: 'required',
    reason: 'Requirements priority is communicated by order.',
    editorPath: 'src/components/admin/cms/editors/JobPositionEditor.tsx',
  },
  {
    id: 'job_position.benefits',
    formId: 'job_position',
    fieldPath: 'benefits',
    policy: 'required',
    reason: 'Benefits list order is user-facing.',
    editorPath: 'src/components/admin/cms/editors/JobPositionEditor.tsx',
  },
  {
    id: 'blog_post.content',
    formId: 'blog_post',
    fieldPath: 'content',
    policy: 'required',
    reason: 'Main article sections are rendered in array order.',
    editorPath: 'src/components/admin/cms/editors/BlogPostEditor.tsx',
  },
  {
    id: 'blog_post.mid_content',
    formId: 'blog_post',
    fieldPath: 'mid_content',
    policy: 'required',
    reason: 'Mid article sections are rendered in array order.',
    editorPath: 'src/components/admin/cms/editors/BlogPostEditor.tsx',
  },
  {
    id: 'careers.job_positions_sort_order',
    formId: 'careers_positions',
    fieldPath: 'sort_order',
    policy: 'required',
    reason: 'Backend query sorts published positions by sort_order.',
    editorPath: 'src/components/admin/cms/JobPositionListTable.tsx',
  },
  {
    id: 'for_creators_benefit.benefits',
    formId: 'for_creators_benefit',
    fieldPath: 'benefits',
    policy: 'forbidden',
    reason: 'Fixed 4 slots keyed by enum IDs; editor keeps IDs read-only.',
    editorPath: 'src/components/admin/cms/editors/ForCreatorsBenefitEditor.tsx',
  },
  {
    id: 'social_commerce_hero.services',
    formId: 'social_commerce_hero',
    fieldPath: 'services',
    policy: 'forbidden',
    reason: 'Fixed 5 semantic service IDs with read-only keys.',
    editorPath: 'src/components/admin/cms/editors/SocialCommerceHeroEditor.tsx',
  },
  {
    id: 'social_commerce_social_proof.items',
    formId: 'social_commerce_social_proof',
    fieldPath: 'items',
    policy: 'forbidden',
    reason: 'Fixed 5 semantic proof IDs with read-only keys.',
    editorPath: 'src/components/admin/cms/editors/SocialCommerceSocialProofEditor.tsx',
  },
  {
    id: 'social_commerce_growth.stats',
    formId: 'social_commerce_growth',
    fieldPath: 'stats',
    policy: 'forbidden',
    reason: 'Fixed 3 semantic stat IDs with read-only keys.',
    editorPath: 'src/components/admin/cms/editors/SocialCommerceGrowthEditor.tsx',
  },
  {
    id: 'social_commerce_value_proposition.items',
    formId: 'social_commerce_value_proposition',
    fieldPath: 'items',
    policy: 'forbidden',
    reason: 'Fixed 3 semantic item IDs with read-only keys.',
    editorPath: 'src/components/admin/cms/editors/SocialCommerceValuePropositionEditor.tsx',
  },
];

export function getCmsListOrderRule(formId: string, fieldPath: string): CmsListOrderRule | null {
  return CMS_LIST_ORDER_RULES.find((rule) => rule.formId === formId && rule.fieldPath === fieldPath) ?? null;
}

export function getCmsListOrderSummary() {
  const required = CMS_LIST_ORDER_RULES.filter((rule) => rule.policy === 'required').length;
  const forbidden = CMS_LIST_ORDER_RULES.filter((rule) => rule.policy === 'forbidden').length;
  const optional = CMS_LIST_ORDER_RULES.filter((rule) => rule.policy === 'optional').length;
  return { required, forbidden, optional, total: CMS_LIST_ORDER_RULES.length };
}
