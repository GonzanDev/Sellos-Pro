---
target: /product/1
total_score: 18
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 5
timestamp: 2026-09-09T14-35-37Z
slug: sellos-frontend-src-pages-productpage-jsx
---
# Design Critique — Product page (sellos-frontend-src-pages-productpage-jsx)

Method: dual-agent (A: design review · B: detector + static evidence) · Mode: Operate · Route /product/1

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Transient toasts; no persistent progress; bare "Cargando" |
| 2 | Match System / Real World | 2 | Price toFixed not es-AR; A-Z/Dibujo codes need reference image |
| 3 | User Control and Freedom | 2 | Modals no Escape; quantity no max; Actualizar -> home not cart |
| 4 | Consistency and Standards | 1 | Blue CTAs vs brand red; #e30613 mixed with red-500/600/700; font grid vs select |
| 5 | Error Prevention | 1 | No quantity cap; no logo size/type guard; empanada validates nothing; description.split unguarded |
| 6 | Recognition Rather Than Recall | 2 | Font letters + Dibujito codes need external image |
| 7 | Flexibility and Efficiency | 2 | Good defaults; no keyboard nav gallery/swatches |
| 8 | Aesthetic and Minimalist | 2 | Up to 4 cross-sell + multiple red buttons crowd above CTA |
| 9 | Error Recovery | 2 | Modal errors inline; personalization errors toast-only |
| 10 | Help and Documentation | 2 | Inline hints ok; no overall guidance |
| Total | | 18/40 | Poor (45%) |

First run for this target — no trend yet.

## Design Specificity Verdict
Workshop-grade in form logic, generic-template at commit layer. Authored: taxonomy personalizer brain (ProductPage.jsx:70-109), to-scale cm die preview (PersonalizerLogo.jsx:192-202), circular swatches, cotizar-vs-price. But: primary CTAs turn BLUE (:578,609,786); canonical #e30613 only 3x while red-500 16x, red-600 8x; buy column top-24 inert (no sticky).
Detector: exit 0, zero findings — regex ruleset only (page analyzers don't run on .jsx). Browser skipped (servers down).

## What's Working
1. To-scale cm die preview — workshop-grade correctness reassurance.
2. Robust product-type branching + edit preload (:70-109, :145-156).
3. Out-of-stock swatches truly disabled (ColorPicker.jsx:48,66).

## Priority Issues
[P0] Off-brand blue CTAs (:578,609,786) at the commit moment. Fix: red/neutral system, two paths distinct within it. Command: colorize.
[P0] Buy area not sticky (top-24 no sticky, :480); CTA buried on mobile below form + 4 cross-sells. Fix: mobile sticky buy bar; cross-sells below CTA. Command: shape.
[P1] Palette drift: red-500 x16, red-600 x8, red-700 x2, canonical only x3. Fix: converge #e30613 + one hover token; standardize focus ring. Command: colorize.
[P1] Both modals inaccessible: no role=dialog/aria-modal, no focus trap, no Escape, no restore, no scroll-lock; labels no htmlFor/id; close btn no aria-label; errors not announced. Command: harden.
[P1] Swatches no keyboard focus/aria (ColorPicker.jsx:45-73), selection color-only. Command: harden.
[P1] Weak validation: quantity unbounded (:598); empanada requires nothing; logo no size/type guard + createObjectURL never revoked (leak); description.split can crash (:466,636). Command: harden.
[P1] Personalization errors toast-only (:233,247) vs modal inline. Fix: inline aria-live field errors. Command: clarify.
[P2] Cross-sell clutter above CTA (:538-569), competing red buttons -> collapse below CTA. Command: distill.
[P2] Actualizar Cambios -> home not cart (:252). Command: shape.
[P2] Uploaded logo never shown, only filename (PersonalizerLogo.jsx:98-101). Command: shape.
[P3] Price not es-AR (toFixed); unused Heart import (:33); inert top-24; English thumbnail alt (:440); stale dev comments.

## Persona Red Flags
Casey: non-sticky CTA behind long form; 27 small font targets; zoom modal no Escape/swipe.
Riley: empanada blank-quote submits; unbounded qty; unguarded/leaked logo upload; add-to-cart not debounced; weak email regex.
Sam: both modals keyboard/SR-unusable (no trap/Escape/labels); swatches + font/kit no focus ring/aria-pressed; validation not announced; English gallery alt.

## Minor Observations
Fuente value shape diverges (Sin preferencia vs sin-preferencia); independent personalizer flags could double-render; touch copy says "Haz clic"; magic product IDs (19/24/25/32/33) inline.

## Questions to Consider
1. If "what you configure is what you get", why no preview of the uploaded logo (only filename)?
2. Why blue exactly when the till opens?
3. Is a 26-letter font wall the honest default, or hide behind "Sin preferencia"?
