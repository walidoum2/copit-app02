# CopIt — AGENTS.md

## Commands
- `npm run dev` — dev server (port 3000)
- `npm run build` — typecheck + production build (run before any commit)
- `npm start` — serve production build
- `npm run lint` — ESLint
- `npm run seed` — full DB seed (shipping rates + admin + products)
- `npm run seed:content` — content seed (FAQ, WhyUs, Brands, Categories, Footer links)
- `npm run seed:admin` — admin user only

## Architecture
- **Next.js 15 App Router** (`src/app/`) with `"use client"` for all pages (no RSC)
- **Prisma ORM** on Neon PostgreSQL — schema at `prisma/schema.prisma`
- **No standalone API framework** — routes live in `src/app/api/`
- **DB singleton** in `src/lib/auth.ts` (exports `prisma` + JWT auth helpers)
- **No Zustand/Redux** — local state + `LangContext` for language
- **No test framework** set up

## Key structure
- `src/app/page.tsx` — homepage (Hero, Marquee, Categories, WhyUs, FAQSection — all inline components)
- `src/app/admin/page.tsx` — single-page admin (login gate + orders/products/shipping/content tabs)
- `src/components/` — Header, Footer, CartDrawer, ProductCard, ProductModal, AdminContent
- `src/data/dictionary.ts` — all translations (FR/AR/EN) via `useLang()` / `t("key")`, plus FAQ_DATA fallback
- `src/contexts/LangContext.tsx` — language state

- **Backup at** `C:\Users\TADJER\Documents\New OpenCode Project\copit-app-backup` — restore code by copying `src/`, `prisma/`, config files back

## Design (light mode — switched from dark in Priority 7 redesign)
- **Light mode**: white background (`--bg: #FCFCFA`), near-black text (`--text: #1A1A1A`), card backgrounds `--bg2: #F0F0EC`
- **Monochrome palette**: `--cop` (#C8C8C8), `--cop-dim` (#969696), `--cobalt` (#555555), `--alert` (#777777), `--accent` (#1A1A1A)
- **Glow effects**: `pulseGlow` on hero, `shimmer` on primary buttons, `float` animation, hover lift + box-shadow on cards
- **Backward compat vars**: `--bone: var(--text)`, `--ink: var(--bg)`, `--ink2: var(--bg2)` for legacy inline SVGs
- **Product palettes**: light gradients (e.g. `#e8ddd6`/`#d4c9bf`) instead of dark
- **2 languages**: French default (LTR), Arabic (RTL). `Lang` type = `"fr" | "ar"`. English removed from UI but `DICT.en`/`FAQ_DATA.en` kept for internal fallback.

## DB content (editable from admin)
Content is stored in DB and fetched by the homepage/Footer with hardcoded fallbacks:
- `npm run seed:content` to re-populate from dictionary
- Public read API: `GET /api/content?type=faq|whyus|brands|categories|footer`
- Admin CRUD: `GET|POST|PUT|DELETE /api/admin/content?type=...`

## Admin
- Login: `admin@copit.dz` / `CopIt2026!` (set via `.env`)
- JWT auth via cookie (`copit_admin_token`)
- Admin API routes (`/api/admin/*`) use `getAuthAdmin()` guard

## Gotchas
- `prisma db push` (not migrate) for schema changes
- Pooled Neon connection: `DATABASE_URL` uses `-pooler` hostname + `?pgbouncer=true` for Prisma; `DIRECT_DATABASE_URL` (no pooler) for migrations
- Content API under `/api/admin/content` requires auth for POST/PUT/DELETE; `/api/content` is public read-only
- Procolis/ZR Express API key is invalid (`"Clé non détectée S2"`) — user must contact ZR Express to activate
- Cloudinary keys are placeholders — not configured
- `.env` contains real DB creds — do not commit
