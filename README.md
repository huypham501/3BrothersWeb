# 3bro web

Marketing site for the 3brothers KOL/KOC agency built with Next.js (App Router), TypeScript, and styled-components. It includes landing pages for creators/brands, mirrored assets from the original site, and Supabase-backed authentication for admin access.

## Stack
- Next.js 14+ (App Router) with TypeScript
- styled-components with shared design tokens, media query helpers, and global styles (`src/styles`)
- Next `poppins` font setup (`src/lib/fonts.ts`)
- Supabase auth (email/password + Google) with browser/server clients and edge proxy refresh (`src/lib/supabase`, `proxy.ts`)
- Swiper for sliders; Next/Image configured for `media.3brothers.net` and `media.metub.net`
- Path alias `@/*` via `tsconfig.json`

## Routes and features
- `/` home composed of sections (Banner, Passion, Information, Passion Crew, Newsletter/Get in touch, Trending)
- `/for-creators`, `/for-brands`, `/our-brand` dedicated landing pages sharing the header/footer and section components
- `/login` email/password + Google auth; `/auth/callback` exchanges Supabase OAuth codes and redirects to `/admin` (guarded)
- API stubs: `POST /api/get-in-touch` and `POST /api/newsletter` (expect Zod schemas in `@/lib/validations`; currently log and return canned responses)
- Mirrored assets live under `public/metub/template/**`

## Requirements
- Node.js 18+
- Yarn (preferred package manager)

## Quickstart
1. Create `.env.local` with Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<anon-public-key>
```
   - Enable the Google provider in Supabase and add `http://localhost:3000/auth/callback` (plus your production origin) as an authorized redirect URL.
2. Install dependencies: `yarn install`
3. Start the dev server: `yarn dev` and open http://localhost:3000

## Scripts
- `yarn dev` — run Next.js dev server
- `yarn lint` — run ESLint
- `yarn build` — production build
- `yarn start` — serve the production build

## Project layout
- `src/app` — App Router routes and metadata (landing pages, login/admin, API handlers, auth callback)
- `src/components` — UI primitives (Button/Heading/Text), layout primitives (Container/Section/Stack/Grid), shared Header/Footer, landing sections
- `src/styles` — design tokens, theme typing, media query helpers, global styles
- `src/lib/supabase` — Supabase config plus browser/server clients and proxy refresh helper
- `public/metub/template` — mirrored fonts/images/video from 3brothers.net

## Notes
- Contact/newsletter forms are UI-only; wire them to persistence/email and add the missing Zod schemas in `@/lib/validations`.
- Jobs/blog CMS, RBAC permissions, and analytics are not implemented yet.
- Keep new styling values sourced from the shared tokens to avoid magic numbers.
