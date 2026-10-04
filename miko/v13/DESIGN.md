# DESIGN.md — Miko Pierson v13 "Platinum Plus"

Brand: warm salon editorial for Miko Pierson — business education for stylists.
Reference family: v10/v12 (scrub-video hero, scroll thread, quiet luxury).
Design read: premium-consumer landing, variance 7 / motion 6 / density 3.
Sources applied: taste-skill (dials, anti-center, materiality), better-typography
(wrap/measure/numerals), scroll-craft (grammar, signature move, verify),
ui-ux-pro-max (scroll-storytelling pattern, stagger list, checklist),
awesome-claude-design (this file's format).

## 1. Visual Theme & Atmosphere
Warm cream canvas, editorial serif moments, quiet-luxury salon tone.
The page is a narrative, not a dashboard: each section is a different
device (chapters), scroll thread is the progress spine.

## 2. Color Palette & Roles
| Token | Hex | Role |
|---|---|---|
| --cream | #F4EEE6 | page canvas |
| --paper | #FBF7F0 | raised surfaces |
| --ink | #26211C | primary text, dark button fill |
| --ink-2 | #4B433B | body/secondary text |
| --ink-3 | #8A7F74 | muted/captions |
| --accent | #9C5530 | terracotta — THE single accent |
| --accent-deep | #6F3A1E | hover/pressed accent |
| --burgundy | #4A1F1F | contrast card (workshop/dark moments) |
| --gold | #B98A4A | sparse highlight only |
| --line | #DCD2C4 | hairlines, borders |

One accent, locked page-wide (color-consistency lock).

## 3. Typography Rules
- Display/body pair: **Fraunces** (600/900 display) / **Hanken Grotesk** (400–700 body).
- `h1` clamp(40px→74px), tracking −.02em, lh 1.1, `text-wrap:balance`.
- `h2` clamp(28→44px), lh 1.1, balance. Body 17px lh 1.65, `text-wrap:pretty`.
- Kickers: Fraunces italic 15px, accent color (no tracked-out ALL-CAPS).
- `.numeral`: Fraunces 900, clamp(140→300px), accent at 14% opacity — the signature move.
- Counters/stats: `font-variant-numeric:tabular-nums`.
- Prose links: `text-underline-position:from-font`.
- Root: `-webkit-font-smoothing:antialiased`; `::selection` = accent on cream.
- Inputs ≥16px (iOS zoom rule). Smart punctuation (em/en dashes, curly quotes).

## 4. Component Stylings
- `.btn`: pill, ink fill + cream text; `.alt` transparent w/ ink border; `.ghost` line border. Hover = translateY(−2px) only.
- `.topnav`: sticky cream bar + 1px border, plain uppercase text keys (13px/600), one terracotta CTA pill. `.float` = fixed over video heroes (dark-gradient scrim, same keys). `.solid` = sticky cream (non-hero pages).
- `.card-feature` (paper + 1px line + r-lg), `.card-item` (accent left-edge, r-sm), `.card-quote` (burgundy dark, editorial). Cards only where elevation = real hierarchy; elsewhere `divide` hairlines.
- `.chan`: paper pill + accent dot — channel labels.
- `.capture`: bordered r-lg form panel; `.consent` dashed-accent block.
- `.seats .bar`: 8px accent progress; `.flow .f`: r-md scenario cards with "—" step markers.
- `.pbcard`: horizontal photo+text link card (120px thumb).

## 5. Layout Principles
- `.wrap` max-width 1120px, 28px gutters; section padding clamp(64px→110px).
- `.split` 50/50 grid collapses at 820px. Measure cap ~34em on ledes.
- Anti-center: heroes split; only the numeral peak + signoff center.

## 6. Depth & Elevation
No pure-black shadows; tinted `rgba(62,44,26,*)` only. Depth via borders + burgundy contrast, not heavy elevation.

## 7. Do's and Don'ts
- DO keep Fraunces+cream+terracotta (brand, Jev-certified; taste-skill override = brand-named palette).
- DO let the scroll thread + hero entrance + one signature move carry ALL motion.
- DON'T add chips/annotation labels to the mock (honesty lives in the demo, not plastered tags).
- DON'T reintroduce uniform card grids, ALL-CAPS eyebrows, or hover-mania.
- DON'T change the accent per-section (color lock).

## 8. Responsive & A11y
- Breakpoints 640/760/820/920. Thread hidden <760px.
- `:focus-visible` 2px accent outline everywhere interactive.
- `prefers-reduced-motion`: kills ALL animation incl. reveal/ken-burns.
- Touch targets ≥44px; contrast: ink-on-cream 11.4:1, accent-on-cream 4.8:1.

## 9. Motion Grammar
- Load: hero staged entrance (cgIn ×4, +120ms) + 14s ken-burns on hero media.
- Scroll: `#thread` progress spine (scaleY, accent).
- Reveal: `.rv` elements stagger in on 20% visibility (IO, i×70ms, 550ms).
- That's it. Three systems, one page.
