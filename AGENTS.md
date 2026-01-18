# 3brothers Website Agent Rule (Editor Agent Prompt)

Use this document as the **single source of truth** for how the editor agent (Copilot/Codex with full access) must plan and implement changes in this repository.

---

## Project summary

Build a company website for the KOL/KOC agency **“3brothers”**:

- Modules: **Landing + Blog + Jobs**
- Framework: **Next.js (latest, App Router)**
- Language: **TypeScript**
- Styling: **styled-components**
- i18n routing: **`/vi`** and **`/en`**
- Deployment: **Vercel**
- Package manager: **Yarn**
- Lint: **ESLint only** (no Prettier unless explicitly requested later)
- Testing: **Vitest (unit)** + **Playwright (e2e)** + **API tests**
- Auth: **Auth.js/NextAuth**, **JWT sessions**
- Roles: **admin**, **editor**, **user** with **configurable permissions**
- Analytics: **Do NOT implement**
- Storybook: **Do NOT use**

---

## Non-negotiable workflow (gating)

### 1) Plan-first, code-second
For every *meaningful* change set (scaffold, tokens/theme, i18n, SEO infra, auth, tests/CI, major refactors):

1. Identify missing decisions and assumptions
2. Present a short **Plan**:
   - steps
   - files to create/modify
   - libraries (if any)
   - verification steps
3. **Wait until the user says “chốt” (approved)** before writing code.

### 2) Show changes only on explicit request
During implementation, if the user signals **“show changes first”** (or equivalent), the agent must **pause** and provide:

- a list of changed files
- per-file diff/patch (or detailed per-file change description if too long)
- how to run and verify locally

Otherwise, proceed with implementation and checkpoint only at major milestones.

---

## Styling refactor standard (CSS → styled-components)

### 1) One component per file
**Mandatory** structure:

- One file per component: `ComponentName.tsx`
- JSX first, styled-components below
- Use named exports: `export function ComponentName(...) {}`

### 2) No magic numbers (UX constraints via tokens)
Do not hardcode arbitrary values such as `12px`, `48px`, `900px` directly inside components.

All values for:
- spacing
- typography (font-size / line-height)
- radius
- breakpoints
- container widths/gutters
- z-index
- motion (duration/easing)

must come from **centralized design tokens**.

> Exceptions: `0`, `1` (e.g., `border: 1px`) are acceptable if aligned with repo conventions.

### 3) Responsive (mandatory)
- **Mobile-first** by default
- Media queries must use a **shared `mq` helper** and **tokenized breakpoints**
- Never hardcode media query numbers inside components (e.g., `@media (max-width: 900px)` is forbidden)

### 4) Mapping legacy CSS to styled-components
When refactoring existing CSS:

- Each legacy CSS class maps to a corresponding styled component (avoid “mega wrapper” dumping)
- If legacy styles have variants (e.g., `.btn.primary` vs `.btn.secondary`):
  - use a `$variant` prop **or** split into separate components
- Style-only props must be prefixed with `$` to avoid leaking into the DOM:
  - `styled.div<{ $variant: "primary" | "secondary" }>`
- Place responsive rules next to the element they affect

### 5) Accessibility baseline
- Use correct semantics (button vs link, correct heading levels)
- Don’t remove focus styles
- Decorative visuals should be `aria-hidden`

---

## Design tokens (bootstrap from existing CSS)

The repository already has existing CSS assets. The agent must:

1. **Read the existing CSS** (including compressed/archived assets if present)
2. Extract repeated values and propose the **initial token scales** for:
   - colors
   - spacing
   - radii
   - typography sizes and line-heights
   - breakpoints
   - container widths/gutters
   - z-index layers
   - motion durations/easings
3. Implement tokens centrally (e.g., `styles/tokens.ts`) and wire to a **typed styled-components ThemeProvider**

Tokens may evolve later—implement in a way that makes migration easy (do not scatter raw numbers).

---

## FE foundation requirements (must be implemented)

- Styled-components ThemeProvider + typed theme
- Global reset + typography base styles
- Layout primitives:
  - `Container`, `Section`, `Stack`, `Grid`, `AppShell`
- i18n implementation:
  - `/vi` and `/en` routing
  - dictionaries
  - locale switcher
  - SEO alternates aligned with locales
- Navigation conventions:
  - active state
  - consistent link structure
- Image strategy:
  - use Next `<Image>`
  - configure `remotePatterns` if needed
- Forms:
  - contact form and job apply form
  - validation and accessibility
- App Router UX states:
  - `loading.tsx`, `error.tsx`, `not-found.tsx`
  - skeleton and empty states where appropriate

---

## SEO requirements (must be implemented)

- Per-route `metadata`
- OpenGraph + Twitter card metadata
- Canonical URLs
- `hreflang`/alternates for VI/EN
- Dynamic `sitemap.xml` and `robots.txt`
- Blog RSS feed
- Structured data:
  - Organization
  - BlogPosting
  - JobPosting
- Performance best practices:
  - `next/font`
  - image sizing and optimization
  - Core Web Vitals friendly defaults

---

## Auth & authorization (current scope)

- Use **Auth.js/NextAuth**
- Session strategy: **JWT**
- Implement roles: `admin`, `editor`, `user`
- Implement **configurable permissions** (permission map / RBAC-like), so capabilities can be changed without rewriting business logic
- Google OAuth:
  - standardized env var names
  - clear callback URL setup
  - `.env.example` required

### Explicitly out of scope (do NOT implement unless user changes scope)
- CSRF hardening
- rate limiting
- brute-force protection

---

## Next.js backend/API (Route Handlers)

- Use Route Handlers only: `app/api/**/route.ts`
- Must have:
  - request validation (e.g., Zod)
  - consistent error response format
  - structured logging + request id
  - upload strategy via signed URLs (S3/R2)
  - email sending capability
  - cron jobs using Vercel Cron (when needed)
- Data layer is “later”, but design interfaces so a future DB/CMS integration can plug in cleanly.

---

## DX / CI / Release

- ESLint strict enforcement
- CI must run:
  - build
  - tests
  - (typecheck is included via build)
- Testing requirements:
  - unit tests with **Vitest**
  - e2e tests with **Playwright**
  - API tests
- Conventional commits + changelog generation (auto)

---

## How to start a work session

If the user says: **“plan refactor step 1”**, the agent should propose a first plan typically like:

1. Parse existing CSS → draft tokens + breakpoints + `mq` helper
2. Add typed ThemeProvider + global styles
3. Refactor 1–2 representative components following the repo standard
4. Verify responsive behavior and basic SEO metadata wiring
