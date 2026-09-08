---
target: catalog
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-09-08T17-55-22Z
slug: sellos-frontend-src-pages-catalogpage-jsx
---
# Design Critique — Catalog (sellos-frontend-src-pages-catalogpage-jsx)

Method: dual-agent (A: design review · B: detector + static evidence) · Mode: Operate

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Bare-text loading; active ?search invisible; no result count |
| 2 | Match System / Real World | 3 | Good es-AR vocab; filter row omits Portátiles/Escolar/KitEmpanadas |
| 3 | User Control and Freedom | 2 | Search unclearable on-page; no quitar filtros; replace:true breaks Back |
| 4 | Consistency and Standards | 2 | Active pill is black (breaks brand red-active rule); error red-600 drift |
| 5 | Error Prevention | 3 | Filters idempotent; bad ?search degrades safely |
| 6 | Recognition Rather Than Recall | 3 | Desktop shows all filters; mobile hides in select |
| 7 | Flexibility and Efficiency | 3 | Shareable URL-state win; no keyboard accelerators |
| 8 | Aesthetic and Minimalist | 3 | Clean but black pill + bland empty state undercut it |
| 9 | Error Recovery | 1 | Raw "Status: 500" in red, no retry despite refetch existing |
| 10 | Help and Documentation | 2 | No count, no guidance on empty results |
| Total | | 24/40 | Acceptable (60%) |

First run for this target — no trend yet.

## Design Specificity Verdict
Category-interchangeable storefront grid, not a workshop counter. Active category pill is solid bg-black (CatalogPage.jsx:153) — black not in palette; DESIGN.md says red is the active/selected signal (One Red Rule). No 1980/locality/stamp motif; bare "Catálogo" title; personality-free empty state. Workshop-specific parts are data, not design.
Detector: exit 0, zero findings (genuine). Browser skipped (servers down); source + static evidence (catalog seen rendering in earlier live session).

## What's Working
1. URL-driven filter/sort/search state (:21-26, 92-110) — shareable/bookmarkable; header search hands off via ?search.
2. ProductCard on-brand + resilient — canonical #e30613, price guardrail, focus-visible, dark→red button.
3. Container discipline — page/header/footer share max-w-7xl + gutters; grid 2→3→4.

## Priority Issues
[P1] Error state off-brand dead end (:116-122) — raw message text-red-600, no retry, replaces whole page. refetch exists (useProducts.js:104) unwired. Fix: friendly copy + Reintentar(refetch), keep chrome, canonical red. Command: harden.
[P1] Active category black + unannounced (:148-159) — bg-black out of palette, no aria-pressed/aria-current, no focus-visible. Fix: active #e30613, aria-pressed, labeled group, focus rings. Command: colorize + harden.
[P1] Active search invisible/unclearable — ?search surfaced only in empty state (:254); no chip/clear when results exist. Fix: "Resultados para 'term' ✕" chip above grid. Command: clarify.
[P2] Loading blocks whole surface (:113-115) bare text; layout jump. Fix: keep chrome + skeleton grid. Command: harden.
[P2] Filter row omits real categories (:138-147) — Portátiles/Escolar/KitEmpanadas unreachable. Fix: derive from data (also fixes KitEmpanadas card path ProductCard.jsx:51). Command: clarify.
[P2] Out-of-stock not shown on cards — stock exists + DESIGN.md "Sin stock" tags; sold-out looks buyable. Fix: disabled/desaturated + label. Command: harden.
[P2] Images not lazy (ProductCard.jsx:66-74) — no loading=lazy/dims; large catalog eager-loads; no pagination. Command: optimize.
[P3] Dead console.log every URL change (:32-38 + useProducts.js:56); truncated names no title (ProductCard.jsx:84); no result count.

## Persona Red Flags
Casey (mobile): taxonomy hidden in select; header-search arrival shows short/empty grid no glanceable why; empty state no tappable escape.
Riley (stress): worst-served — loading blanks page, error raw dead end, 1000 products render at once eager images. ?search safe.
Sam (a11y): pills tabbable but active not announced (no aria-pressed); sort label not associated (htmlFor/id); no aria-live on results; inconsistent focus.

## Minor Observations
Two <h1> in DOM (desktop+mobile blocks); red-600 error drift; header price toFixed vs es-AR; mobile "Categorías" vs desktop "Todas"; isKitProduct only matches "kits" so KitEmpanadas misses cotizar path.

## Questions to Consider
1. Why does the most-touched control announce selected in black when red means selected?
2. Error fix (refetch) already exists unwired — happy-path only?
3. Page knows stock, taxonomy, active search — surfaces none. Filter surface or picture wall?
