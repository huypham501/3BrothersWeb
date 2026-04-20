export const SCHEMA_KEYS = {
    GLOBAL_HEADER: 'global.header.v1',
    GLOBAL_FOOTER: 'global.footer.v1',
    GLOBAL_SEO_DEFAULTS: 'global.seo_defaults.v1',
    GLOBAL_SITE_METADATA: 'global.site_metadata.v1',
    HOME_HERO: 'home.hero.v1',
    HOME_PARTNERS: 'home.partners.v1',
    HOME_CORE_COMPETENCIES: 'home.core_competencies.v1',
    HOME_EFFICIENCY: 'home.efficiency.v1',
    HOME_TRENDING: 'home.trending.v1',
    SHARED_EXCLUSIVE_TALENTS: 'shared.exclusive_talents.v1',
    SHARED_CONTACT_CTA: 'shared.contact_cta.v1',
    FOR_CREATORS_HERO: 'for_creators.hero.v1',
    FOR_CREATORS_BENEFIT: 'for_creators.benefit.v1',
    FOR_CREATORS_TESTIMONIALS: 'for_creators.testimonials.v1',
    FOR_CREATORS_CTA: 'for_creators.cta.v1',
    CAREERS_HERO: 'careers.hero.v1',
} as const;

export type SchemaKey = typeof SCHEMA_KEYS[keyof typeof SCHEMA_KEYS];
