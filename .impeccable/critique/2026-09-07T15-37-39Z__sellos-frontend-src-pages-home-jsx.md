---
target: Home
total_score: 28
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-09-07T15-37-39Z
slug: sellos-frontend-src-pages-home-jsx
---
# Design Critique (run 3) — Home (sellos-frontend-src-pages-home-jsx)

Method: dual-agent · Mode: Persuade

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Skeleton/scoped-error/aria-current; gap: no aria-live on slide change |
| 2 | Match System / Real World | 4 | es-AR, real trade terms — improved |
| 3 | User Control and Freedom | 3 | Pause/prev/next/dots/swipe; autoplay doesn't pause on hover/focus |
| 4 | Consistency and Standards | 2 | Header/Footer still red-600; Footer routes /faq,/contact vs /nosotros,/contacto; toFixed vs toLocaleString; card button vs kit Link |
| 5 | Error Prevention | 3 | Great data-states; Footer mismatched routes risk 404 |
| 6 | Recognition Rather Than Recall | 4 | Clear nav, labels, search preview |
| 7 | Flexibility and Efficiency | n/a | Persuade landing |
| 8 | Aesthetic and Minimalist | 4 | Clean, on-brand, one-red |
| 9 | Error Recovery | 4 | PreviewError exemplary — retry + WhatsApp, scoped |
| 10 | Help and Documentation | n/a | Landing; WhatsApp substitutes |
| Total | | 28/32 | Good (87.5%) |

Trend: 19 -> 28 -> 28. Score held; composition shifted. All prior P0/P1/P2 fixed; remaining deductions are mostly in global Header/Footer (outside original Home-component scope) + two Home nits.

## Design Specificity Verdict
Now credibly authored for a stamp workshop. Persistent Hero ribbon "Fabricantes de sellos en Mar del Plata · desde 1980" (Hero.jsx:162-165) locks identity on first frame; identity band names real catalog vocab + 3 positioning pillars. Generic seam: "Los Más Vendidos" featured grid, bestseller label backed by hardcoded IDs [1,100,102,20] not sales data (mild honesty stretch).
Detector: exit 0, zero findings (page-level analyzers skip .jsx). Browser: skipped (backend down). Fixes confirmed: PreviewEmpty branch, persistent identity line, desktop arrows, dot focus-visible, canonical #e30613 on card (title hover/price/PROMO), max-w-7xl + px-4 sm:px-6 lg:px-8 matching Home/Header/Footer, "Ver producto" label.

## What's Working
1. Bestseller-section state handling (skeleton/empty/error) standout; Hero/page always render.
2. Hero a11y deliberate + correct (single h1, h2 slides, aria-hidden+tabIndex -1, 40px dots + focus-visible, reduced-motion disables autoplay + transition).
3. Identity band on-brand, truthful, canonical red once.

## Priority Issues
[P1] Hero slide CTA no focus-visible ring (Hero.jsx ~204). Highest-value action missed while other Hero controls got rings. Fix: focus-visible outline white. Command: harden.
[P1] Footer routes mismatch (Footer.jsx:63,68 /faq,/contact vs Header /nosotros,/contacto). Same label, different destination -> dead-ends. Command: clarify/layout.
[P2] Red not fully converged: Header wordmark/active-nav/cart-badge + Footer still red-600; card #e30613 under red-600 wordmark. Command: colorize.
[P2] Standard card CTA is <button onClick=navigate> vs kit <Link> — breaks middle-click/new-tab, inconsistent. Fix: styled <Link>. Command: harden.
[P3] Carousel no pause-on-hover/focus + no aria-live on slide change. Command: harden/animate.
[P3] "Los Más Vendidos" unbacked claim + flat band. Rename to Destacados/Selección del taller + context line. Command: clarify.
[P3] Header search-preview price toFixed(2) not toLocaleString(es-AR). Command: clarify.

## Persona Red Flags
Jordan: promo-first slide; identity ribbon text-xs can be missed; Hero CTA no focus ring; Footer Nosotros may 404.
Casey: well served (swipe, 40px); autoplay advances mid-read (no hover/focus pause).
Riley: empty list handled (PreviewEmpty); API error handled; long names truncate no tooltip; slow 3G Hero bg no priority hint/placeholder.

## Minor Observations
Header cart & mobile-menu icon buttons lack focus-visible + aria-label. Identity band left-aligned vs bestseller centered. console.log diagnostic every fetch (useProducts.js:56, intentional). Home.jsx:26 imports from ../../../backend/utils (architectural smell).

## Questions to Consider
1. Is a text-xs ribbon enough for the trusted-workshop first impression, or should identity share Hero visual weight?
2. Is an unbacked "más vendidos" a quieter version of forbidden fabricated proof?
3. Has the section been engineered to degrade better than it succeeds?
