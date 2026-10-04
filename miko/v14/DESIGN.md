# DESIGN.md — Miko v14 "Forest" — editorial evolution of v10/v12

Direction: USER-APPROVED via skill-arbitrated choices —
Grammar: **filmic one-shot** (scroll-craft 2.1, Jev P 1.0 — the family's own
grammar). Palette: **Forest** (Jev 0.68, user-picked). Type: **Instrument
Serif + Geist** (user-picked). Hero: **photo editorial — red-hair car shot,
big type** (Jev 0.65, user-picked). Brand guide abandoned by license.
First v14 (live-surface console) was unsanctioned — shelved in git history;
this is the corrected architecture.

## 1. Theme & Atmosphere
Dark forest editorial — cinematic, warm-luxe, her photo at full bleed.
Bone-on-green, single muted-gold accent, Instrument Serif italic doing
the display work like Fraunces did for the family.

## 2. Color (one accent locked)
| Token | Hex | Role |
|---|---|---|
| --bg | #1C2B21 | page canvas (deep forest) |
| --bg-2 | #15211A | deeper field (footer, inputs) |
| --panel | #24352A | raised surfaces |
| --bone | #EFE9DC | primary text |
| --bone-2 | #C9C3B4 | secondary text |
| --muted | #8FA08C | labels/captions |
| --gold | #B98A4A | THE accent — em italics, CTAs, kickers, thread |
| --gold-soft | rgba(185,138,74,.16) | consent/consent washes |
| --line | #35473B | hairlines |

## 3. Typography
- **Instrument Serif** display (400 + italic — the italic IS the style):
  h1 clamp(46→88px), h2 clamp(30→50px), lh 1.08, `text-wrap:balance`.
- Gold italic `em` = the accent inside headlines (v12's italic-trick evolved).
- **Geist** body/UI (300-600). Kickers = serif italic gold (no ALL-CAPS).
- **JetBrains Mono** only for system numerals: seats, scroll-hint.
- `.numeral` signature: serif italic 400, clamp(160→340px), gold at 16% —
  the same "one" peak, now in the new voice.
- Body 16px lh 1.65, `pretty` wrap, measure ≤34em; inputs ≥16px;
  `tabular-nums` on counts; `::selection` gold.

## 4. Components
- `.topnav`: fixed filmic bar — wordmark + text keys + ONE bone-pill CTA;
  gradient scrim over hero.
- `.hero`: full-bleed photo + forest scrim gradient, corner-anchored
  staged copy (cgIn ×4), slow ken-burns settle (18s scale 1.06→1).
- `.chan` pill strip; `.capture` panel form; `.card-feature` (panel) vs
  `.card-contrast` (gold field w/ ink text — the inverted decision card);
  `.row-list` hairlines; `.flow` scenario cards w/ gold "—" markers;
  `.seats` metric bar; `.pbcard` photo+text links; `#thread` gold spine.
- `.btn`: bone pill (gold on hover), `.alt` transparent.

## 5. Layout
`.wrap` 1180px, 30px gutters; section pad clamp(70→120px); `.split` 50/50
collapse <820px. Anti-center except the numeral peak + signoff.

## 6. Depth
No shadows — panel borders + scrim gradients carry depth. One accent.

## 7. Do / Don't
- DO keep hero full-bleed photo + staged entrance (filmic hero spec).
- DO keep `em`-in-gold as the display accent move.
- DON'T reintroduce chips/labels, cream/terracotta, marketing chrome,
  second accents, or change the hero asset (user-specified photo).

## 8. Responsive & A11y
- <760px: nav collapses to brand + CTA; thread hidden; hero min-height
  keeps scrim coverage.
- `:focus-visible` gold outline; `prefers-reduced-motion` → instant states;
  contrast: bone-on-forest ≥12:1, gold-on-forest ~4.6:1, inputs 16px.
- Reveal fallback: scroll listener forces `.rv` visible (no ghost sections
  on fast scrolls).

## 9. Motion grammar (filmic toolkit)
- Hero: staged cgIn + 18s ken-burns settle.
- Scroll: `#thread` gold progress spine (family signature).
- Sections: `.rv` stagger reveals; seat bar fills on entry.
- That's it — one orchestrated system.
