---
name: ui-ux-pro-max
description: Apply when designing or reviewing UI components, layouts, responsive behavior, user flows, accessibility, or visual polish for the CopIt e-commerce site.
---

# UI/UX Pro Max

CopIt is a sneakers & streetwear e-commerce site targeting young Algerians. The aesthetic is monochrome, minimal, bold, and streetwear-culture inspired.

## Visual identity
- **Palette**: monochrome grays only — `--cop` (#C8C8C8), `--cop-dim` (#969696), `--cobalt` (#A8A8A8), `--alert` (#777777). NO amber, green, cobalt, or colored accents.
- **Typography**: monospace (`mono` class) for SKUs, prices, technical labels. Display headings for section titles.
- **Layout**: `wrap` max-width container, `hero-grid`, `cat-grid`, `why-grid`, `grid-products` for responsive grids.
- **Components**: `btn`, `btn-primary`, `btn-outline`, `btn-sm`, `btn-block`. `status-pill` for order states.
- **Icons**: inline SVGs with `currentColor` for stroke/fill.

## UX guidelines
- **Mobile-first**: all layouts must work on small screens first, then expand.
- **3 languages**: French (default, LTR), Arabic (RTL), English (LTR). Use `useLang()` hook and `t("key")` for all user-facing strings.
- **Loading states**: show skeleton or `Loading...` text while data fetches.
- **Empty states**: meaningful message (e.g. "Cart is empty") when no data.
- **Errors**: toast notifications via `showToast()` with auto-dismiss. Graceful fallback values when DB unavailable.
- **Forms**: validate before submit, disable button while saving, show inline validation.
- **Navigation**: use `next/link` for internal routes, never `<a>`.

## Responsive breakpoints
Use CSS `@media` queries. The site targets mobile (320px+), tablet (768px+), desktop (1024px+). The admin panel is desktop-first.

## Accessibility
- Labels on all form inputs
- Sufficient contrast (gray on dark backgrounds)
- Keyboard-navigable
- RTL support with `dir` attribute on Arabic

## Admin panel
- Single-page app with login gate, tabs (orders / products / shipping / content)
- Inline editing (click Edit, form appears in-place)
- Toast notifications for feedback
