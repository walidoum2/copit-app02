# CopIt Design System v2

## Type Scale
| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `.text-display` | clamp(36px, 5vw, 72px) | Anton 400 | Hero H1, page titles |
| `.text-heading` | clamp(24px, 3vw, 36px) | Anton 400 | Section H2 |
| `.text-subhead` | 19px | Anton 400 | Card/panel titles |
| `.text-body` | 14px | Inter 400 | Paragraphs, descriptions |
| `.text-caption` | 13px | Inter 400 | Secondary text |
| `.text-price` | 15px | JetBrains Mono 700 | Prices |
| `.text-label` | 11px | JetBrains Mono 700 uppercase | Labels, eyebrow |
| `.text-meta` | 10.5px | Inter 600 uppercase | Brand, SKU |

## Spacing Scale
`--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 24px`, `--space-6: 32px`, `--space-7: 48px`, `--space-8: 64px`

## Palette (monochrome, unchanged)
- `--bg: #FCFCFA`, `--bg2: #F0F0EC`
- `--text: #1A1A1A`, `--text-dim: #6B6B6B`
- `--cop: #C8C8C8`, `--cop-dim: #969696`
- `--cobalt: #555555`, `--steel: #8A8D93`, `--alert: #777777`
- `--line: rgba(0,0,0,0.08)`, `--radius: 2px`

## Product Cards (v2)
- 1:1 image aspect ratio, full-bleed
- Tag badge: top-left, small, bold, bg=text, color=bg
- Info below: brand (label), name (body bold), price row (now/was)
- Stock bar (copmeter) only on cards with low stock (< 8 units)
- 4 cols desktop, 2 cols tablet, 2 cols mobile

## Badges
`.badge` — 10px, 800 weight, uppercase, letter-spacing 0.5px, bg=--cop, color=--bg, padding 4px 8px

## Buttons (unchanged)
`.btn`, `.btn-primary`, `.btn-outline`, `.btn-sm`, `.btn-block`

## Motion Tokens
- Entry: `fadeUp` 0.5s ease (existing)
- Hover: translateY(-4px) + box-shadow 0.25s ease (existing)
- Active: scale(0.97) 0.15s ease (existing)
