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
- `src/app/page.tsx` — homepage (Hero, Marquee, CategoryCard, Products, WhyUs, FAQSection — all inline components)
- `src/app/admin/page.tsx` — single-page admin (login gate + orders/products/shipping/content/landing tabs)
- `src/components/` — Header, Footer, CartDrawer, ProductCard, ProductModal, AdminContent, AdminLanding, AdminSlides
- `src/data/dictionary.ts` — all translations (FR/AR/EN) via `useLang()` / `t("key")`, plus FAQ_DATA fallback
- `src/contexts/LangContext.tsx` — language state

## Homepage structure (top→bottom)
1. **Promo bar** — reads from `landingSettings["promo_*"]` keys (text, visibility, colors, size, padding). Fully customizable from admin `landing` tab.
2. **Hero** — "LIKE IT. WANT IT. COP IT." with two CTAs: Voir le Drop + Promos
3. **Marquee** — CSS-animated brand ticker (NIKE, ADIDAS, ASICS, NB, JORDAN, COPIT, PUMA, CONVERSE). No JS, pure `@keyframes marqueeScroll`. Respects `prefers-reduced-motion`.
4. **CategoryCard** — single large horizontal card for `Chaussures` slug from DB → scrolls to `#sneakers-section`. Shows **nothing** if Chaussures doesn't exist in DB (no fallback categories).
5. **Dernières Sneakers** — product section anchored at `#sneakers-section`. Fetches `/api/products?limit=4&category=Chaussures`. No "Tout voir" button.
6. **Why Us** — 4 icon cards from DB or fallback.
7. **FAQ** — accordion from DB or fallback.
8. **Footer** — logo, phone, social, legal links.
9. **Floating cart** — fixed bottom-right button.

## Category system
- **Source of truth**: `CategoryContent` model in DB with `active`, `slug`, `order`, `imageUrl`, trilingual names
- **Public API**: `GET /api/content?type=categories` — returns only `active: true` categories
- **Admin API**: `GET|POST|PUT|DELETE /api/admin/content?type=categories` — full CRUD
- **Homepage**: finds `slug === "Chaussures"` from API data. If missing or empty, no category renders.
- **No hardcoded fallback** — deleted categories fully disappear.
- **Navigation** (Header.tsx) nav links are **still hardcoded** — `/shop?category=Chaussures` etc.

- **Backup at** `C:\Users\TADJER\Documents\New OpenCode Project\copit-app-backup` — restore code by copying `src/`, `prisma/`, config files back

## Design (dark premium monochrome streetwear)
- **Dark mode**: deep black (`--bg: #0A0A0A`), white text (`--text: #F0F0F0`), charcoal cards `--bg2: #141414`, dark gray `--bg3: #1E1E1E`
- **All rounded**: `--radius: 12px` on cards, buttons, inputs, drawers
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` for all transitions/animations
- **Floating cart**: fixed bottom-right white circle with badge count (class `.fcart`)
- **Hero**: "LIKE IT. WANT IT. COP IT." stacked bold typography with radial glow, two pill CTAs (`.hero-premium`)
- **Category grid**: 2 square + 1 wide, dynamic admin images with gradient overlay (`.cat-grid-premium`)
- **Product grid**: fixed 2 columns, dark cards, rounded images, brand + name + price + white Add to Cart button (`.grid-products-premium`)
- **Why Us**: 4 icon cards with hover lift (`.why-grid-premium`)
- **FAQ**: dark accordion with plus/minus toggle, smooth open (`.faq-list-premium`)
- **Backward compat vars**: `--bone: var(--text)`, `--ink: var(--bg)`, `--ink2: var(--bg2)` for legacy inline SVGs
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
