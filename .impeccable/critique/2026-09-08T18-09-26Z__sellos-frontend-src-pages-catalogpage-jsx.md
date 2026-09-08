---
target: catalog
total_score: 37
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-09-08T18-09-26Z
slug: sellos-frontend-src-pages-catalogpage-jsx
---
# Design Critique (re-run) — Catalog (sellos-frontend-src-pages-catalogpage-jsx)

Method: dual-agent · Mode: Operate

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Skeleton, live count, active state, search chip — scoped |
| 2 | Match System / Real World | 4 | Fluent es-AR, data-derived categories, Sin stock |
| 3 | User Control and Freedom | 3 | replace:true means Back doesn't undo a filter |
| 4 | Consistency and Standards | 3 | Out-of-stock card still shows live purchase CTA |
| 5 | Error Prevention | 4 | No invalid states; weird ?search degrades recoverably |
| 6 | Recognition Rather Than Recall | 4 | Filters/active/count on-screen |
| 7 | Flexibility and Efficiency | 4 | URL-shareable filter+sort+search, memoized |
| 8 | Aesthetic and Minimalist | 4 | Restrained, on-brand, border-first |
| 9 | Error Recovery | 4 | Scoped error + refetch + WhatsApp; empty reset |
| 10 | Help and Documentation | 3 | No help affordance (defensible) |
| Total | | 37/40 | Excellent (92.5%) |

Trend: 24 -> 37. Up 13, Acceptable -> Excellent. All prior P1/P2 resolved.

## Design Specificity Verdict
Now authored for the workshop: two-path card CTAs, warm es-AR recovery + real WhatsApp, data-derived categories (Portátiles/Escolar/KitEmpanadas reachable), zero red drift on this surface. Weak spot: out-of-stock card still reads purchasable.
Detector exit 0, zero findings. Browser skipped (servers down). Fixes verified: scoped loading/error+skeleton+refetch, search chip+clear, aria-live count, dynamic shared categories, aria-pressed+group+focus-visible pills, associated sort labels, single h1, OOS badge/desaturation, lazy images, name title, KitEmpanadas path, debug logs gone.

## What's Working
1. State scoped not page-blocking; status bar min-h avoids layout shift.
2. Genuine recovery (error refetch+WhatsApp; empty resetAll) in es-AR.
3. A11y scaffolding largely correct.

## Priority Issues
[P1] Out-of-stock still purchasable-looking (ProductCard.jsx:56, CTA :129-148). Fix: disable/neutralize CTA + aria-disabled when OOS. Command: harden.
[P1] Header + Catalog each fetch /products (useProducts per-mount, not Context) -> two GETs, silent header failure. Fix: lift to one Context/shared cache. Command: optimize. (pre-existing)
[P2] replace:true breaks Back (:176,183,189). Fix: push for category/sort, replace only for debounced search. Command: clarify.
[P2] "Ver producto" is button+navigate (:143-148) to same route as image link. Fix: styled Link. Command: shape.
[P3] Filter row no loading placeholder (categories derive from products; pop-in). Command: harden.
[P3] aria-live region conditionally mounted (:309) -> initial count may be missed. Fix: keep mounted, empty while loading. Command: harden.

## Persona Red Flags
Casey: labeled selects thumb-ok; active category only in closed select; PROMO hidden md:inline (mobile loses promo cue).
Riley: 0-results/error/long-names/weird-search handled; no pagination/virtualization (cliff at 1000); double-fetch doubles stress.
Sam: filters/labels/count announced; black active pill passes AA (accepted); thin sort focus ring vs pills 2px; gray-500 near AA floor.

## Minor Observations
Stale ProductCard/Header comments (add-to-cart, Context that doesn't exist); header preview price toFixed (not es-AR, unguarded can throw); straight vs curly quotes; mobile border-gray-200 vs desktop border-gray-300.

## Questions to Consider
1. Out-of-stock with a live Cotizar CTA = pointing at an empty shelf in silence?
2. At what catalog size / whose 3G does header search become twice-the-load half-failing?
3. Black active pill: crisp two-signal system or hairline crack in "red means selected"?
