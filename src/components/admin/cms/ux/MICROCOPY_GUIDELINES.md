# CMS Field Microcopy Guidelines

Use `CmsFieldHint` for fields that are technical, easy to misunderstand, or have high-impact behavior.
Define source-of-truth specs in `src/lib/cms/ux/field-ux-spec.ts`.

## Template

- `What`: what this field stores.
- `Why`: why editors should care.
- `Format`: accepted input format.
- `Impact`: what changes when the value changes.
- `Example`: one concrete example value.

## Rules

- Prefer plain language and short sentences.
- Keep hints actionable and specific to CMS behavior.
- Do not hide critical instructions in tooltip only.
- Include `Format` when invalid input is common.
- Include `Impact` for publish, visibility, indexing, routing, and data-source switches.

## Usage

```tsx
const ux = (fieldPath: string) => getCmsFieldUxSpec('home_page_settings', fieldPath);

<FormLabel>{ux('canonical_url').label ?? 'Canonical URL'}</FormLabel>
<CmsFieldHint formId="home_page_settings" fieldPath="canonical_url" />
```

## Phase 3 Contract

- Do not hardcode field help copy in editor components.
- Keep label/help/example/validation/impact in the UX spec registry.
- Editors should reference UX text by `formId + fieldPath`.
