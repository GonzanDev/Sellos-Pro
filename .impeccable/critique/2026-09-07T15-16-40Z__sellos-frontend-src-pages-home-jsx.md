---
target: Home
total_score: 28
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
timestamp: 2026-09-07T15-16-40Z
slug: sellos-frontend-src-pages-home-jsx
---
# Design Critique (re-run) — Home (sellos-frontend-src-pages-home-jsx)

Method: dual-agent (A: design review · B: detector + static evidence) · Mode: Persuade

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Skeleton w/ role=status, scoped error, retry — strong |
| 2 | Match System / Real World | 3 | es-AR correct; Hero slide 1 leads with jargon before offer explained |
| 3 | User Control and Freedom | 3 | Pause + swipe + dots; no desktop prev/next arrows |
| 4 | Consistency and Standards | 3 | Card mixes red-600 (price/PROMO) with #e30613 (CTA); footer gutter px-6 vs page ramp |
| 5 | Error Prevention | 3 | Error path solid; empty-filtered-list unhandled |
| 6 | Recognition Rather Than Recall | 4 | Persistent nav, visible preview, clear catalog CTA |
| 7 | Flexibility and Efficiency | n/a | Persuade landing |
| 8 | Aesthetic and Minimalist | 4 | Clean, on-brand; Hero slightly promo-heavy |
| 9 | Error Recovery | 4 | Human message, in-place retry, WhatsApp fallback, section-scoped |
| 10 | Help and Documentation | n/a | Landing surface |
| Total | | 28/32 | Good (87.5%) |

Trend: 19/32 -> 28/32 (+9). All P0 and both original P1s resolved.

## Design Specificity Verdict
Split: one authored section (identity strip Home.jsx:131-158 — fabricante local, desde 1980, positioning triad, no fabricated proof) on a still-generic Hero (3 promo slides; positioning line is sr-only, so sighted first-viewport users see "sale" not "local maker since 1980").
Detector: exit 0, zero findings (genuine; page-level analyzers skip .jsx; no false positives).
Browser: skipped (backend down -> grid error state). Fixes verified via source/static: single stable h1 + h2 slides, prefers-reduced-motion, aria-hidden inactive slides + tabIndex -1, 40px dots, focus-visible on error buttons + CTA, "Ver producto" label, max-w-7xl consistent.

## What's Working
1. Error + loading handling best-in-class (Home.jsx:42-107) — scoped, refetch retry, skeleton no layout shift, WhatsApp fallback.
2. Identity strip copy — truthful, specific, One Red Rule honored.
3. Carousel a11y real (verified both assessments).

## Priority Issues
[P1] Empty bestseller grid, no empty state. getProductsByIds hardcoded IDs [1,100,102,20]; if they drift, renders <CatalogPreview products={[]}> -> heading+blank+button silent void. Fix: branch on length===0 -> fallback + catalog CTA. Command: harden. (Deferred from first pass.)

[P2] Hero leads with promo; positioning line sr-only/below fold. First frame = DESCUENTOS POR LANZAMIENTO (Hero.jsx:31). Fix: visible value line or identity-first frame. Command: clarify. (User chose keep-carousel; this is message, not restructure.)

[P3] Canonical-red drift on card. red-600 price/PROMO (ProductCard.jsx:99,105) vs #e30613 CTA. Fix: converge on #e30613/#b91c1c. Command: colorize.

[P3] Footer gutter mismatch. Footer px-6 (Footer.jsx:33) vs page px-4 sm:px-6 lg:px-8. Fix: standardize. Command: layout.

[P3] No desktop prev/next arrows on carousel. Dots+swipe only; goToPrev/Next exist. Fix: add arrows. Command: harden.

## Persona Red Flags
Jordan (first-timer): discount-banner first frame, jargon before definition, must scroll for identity. (P2)
Casey (mobile one-handed): thumb reach ok; 60-70vh Hero pushes identity below fold; autoplay moves content mid-read; pause target small corner. (P2)
Riley (stress): empty list -> silent blank grid (P1); API error handled (pass); slow 3G Hero bg not lazy + product imgs no width/height (LCP flash); reduced-motion passes.

## Minor Observations
Dot buttons + "Ver producto" button lack focus-visible (error buttons + CTA have it). Footer links /faq + /contact vs app routes /nosotros + /contacto (dead/dup). console.log diagnostic every fetch (useProducts.js:56, intentional). Hero CSS background-image no lazy/fetchpriority; product img no width/height. Home.jsx:26 imports from ../../../backend/utils.

## Questions to Consider
1. First viewport: "we make custom stamps since 1980" or "there's a sale"?
2. Is the promo carousel earning prime position over the heritage story?
3. What makes the working state as warm/on-brand as the error state?
