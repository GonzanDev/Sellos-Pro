---
target: Home
total_score: 19
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
timestamp: 2026-09-07T14-38-44Z
slug: sellos-frontend-src-pages-home-jsx
---
# Design Critique — Home (sellos-frontend-src-pages-home-jsx)

Method: dual-agent (A: design review · B: detector + browser evidence)
Mode: Persuade · Surface: sellos/frontend/src/pages/Home.jsx (+ Hero, CatalogPreview, ProductCard)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Loading/error states exist but loading copy is broken; no autoplay progress cue |
| 2 | Match System / Real World | 3 | Domain language right; missing es-AR accents read sloppy to a business buyer |
| 3 | User Control and Freedom | 2 | Carousel autoplays with no pause (WCAG 2.2.2 fail) |
| 4 | Consistency and Standards | 2 | max-w-screen-2xl vs site max-w-7xl; mixed reds; two button languages |
| 5 | Error Prevention | 2 | Good price guardrail, but no empty-state guard on bestseller grid |
| 6 | Recognition Rather Than Recall | 3 | Image+name+price cards; no memory burden |
| 7 | Flexibility and Efficiency | n/a | Persuade landing; global header search covers accelerators |
| 8 | Aesthetic and Minimalist | 3 | Clean/on-brand; hero scrim+white-pill is a generic cliché |
| 9 | Error Recovery | 2 | Error is a dead-end red line — no retry, no WhatsApp fallback |
| 10 | Help and Documentation | n/a | Persuade landing; help/contact in nav + footer |
| Total | | 19/32 | Acceptable (59%) |

## Design Specificity Verdict
Category-interchangeable. Strip the slide strings and it's a generic carousel→bestseller-grid→catalog-button landing. "Sello" appears zero times in body copy the visitor reads. The truest asset — local manufacturer since 1980 — never appears above the fold; page opens on a launch-discount banner. Authentic DNA: two-path card logic (Personalizar y Cotizar vs Agregar, ProductCard.jsx:115-136), undermined by a mislabeled button (P3).

Deterministic scan: detect.mjs exit 0 / zero findings across all four files; verified genuine (positive control tripped correctly). Caveat: page-level analyzers do NOT run on .jsx, so "clean" only covers regex rules — not copy, states, motion a11y, or hierarchy. No false positives. All priority issues are outside the detector's rule set.

Visual overlays: none. Live browser inspection not performed (backend down → grid shows error state; headless subagent couldn't complete Chrome permission handshake). Findings grounded in source + static evidence.

## What's Working
1. Two-path button semantics (ProductCard.jsx:115-136) — real quote-vs-buy model in the tile.
2. Disciplined on-brand restraint — white cards, hairline borders, shadow-sm→lg hover + scale-105 (ProductCard.jsx:61,75).
3. Robust data guardrails — price typeof check (:28) + category normalization (:41-53).

## Priority Issues
[P0] Loading state ships a dev cold-start apology to production. Home.jsx:65 "Cargando... vuelva en 1 minuto que la pagina ya deberia estar lista" — unstyled, blocks whole page incl. Hero. Fix: skeleton grid, render Hero immediately, remove apology. Command: harden (+ clarify).

[P1] Autoplay carousel can't be paused and hijacks the only <h1>. Hero.jsx auto-advances 5s, no stop (WCAG 2.2.2). Three <h1> mount at once (:216) → headline mutates every 5s. CSS background-image → no alt (:199-205). Dots 10x10px (:246). Fix: play/pause toggle, prefers-reduced-motion, one stable h1, demote slide titles to h2, aria-label/alt, ≥40px dot hit-area. Command: harden (+ animate).

[P1] No heritage/orientation in first viewport. "desde 1980"/Mar del Plata absent above fold; opens on promo. Fix: lead slide 1 or a trust band with real signals (fabricante local, desde 1980, personalización online); no fabricated proof. Command: onboard (+ clarify).

[P2] Empty-state void in Los Más Vendidos. getProductsByIds returns [] on drift/empty API → orphan heading + gap (CatalogPreview.jsx:33). Fix: guard length===0, hide or neutral fallback. Command: harden.

[P2] Container width + heading break the system. Home max-w-screen-2xl (1536) vs Header/Footer max-w-7xl (1280); title text-2xl vs DESIGN.md text-3xl. Fix: max-w-7xl + text-3xl. Command: layout (+ typeset).

[P3] "Agregar" button lies + dead code. Button says Agregar but navigates (ProductCard.jsx:130-131); unused addToCart threaded Home→CatalogPreview→ProductCard + toast wrapper Home.jsx:55-60. Fix: relabel to Ver producto/Personalizar (or honor quick-add), remove dead path. Command: clarify (+ distill).

## Persona Red Flags
Jordan (first-timer): no orientation, rotating headline flips mid-read, missing heritage.
Casey (mobile one-handed): ~10px dots unhittable, no pause, high CTA in 60vh block.
Riley (stress): empty grid void, full-page error dead-end, cold-start apology; truncate holds; slow-3G all webp load up-front, text on black until image loads.

## Minor Observations
Missing es-AR accents (automaticos, pagina, deberia, Veni, consultanos, Prepara); unused Navigate import (ProductCard.jsx:22); off-palette text-red-500 error; redundant duration-1000 + inline transition (Hero.jsx:195,200), 1s fade overlaps headlines; non-standard lg:h-110 (:183); PROMO tag hidden md:inline (mobile never sees it); large unused jpg/HEIC originals (up to 2.2MB) in public/images/Hero/.

## Questions to Consider
1. Should the Hero lead with heritage instead of a promo?
2. Does an autoplay carousel belong here at all vs one decisive hero + category doors?
3. Is a hardcoded 4-ID bestseller grid earning prime real estate, or should Home route the two buyers?
