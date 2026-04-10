export const SCHEMA_KEYS = {
    GLOBAL_HEADER: 'global.header.v1',
    GLOBAL_FOOTER: 'global.footer.v1',
    HOME_HERO: 'home.hero.v1',
    HOME_PARTNERS: 'home.partners.v1',
    HOME_CORE_COMPETENCIES: 'home.core_competencies.v1',
    HOME_EFFICIENCY: 'home.efficiency.v1',
    HOME_TRENDING: 'home.trending.v1',
    SHARED_EXCLUSIVE_TALENTS: 'shared.exclusive_talents.v1',
    SHARED_CONTACT_CTA: 'shared.contact_cta.v1',
} as const;

export type SchemaKey = typeof SCHEMA_KEYS[keyof typeof SCHEMA_KEYS];
