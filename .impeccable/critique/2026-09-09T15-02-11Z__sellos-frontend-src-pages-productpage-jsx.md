---
target: /product/1
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
timestamp: 2026-09-09T15-02-11Z
slug: sellos-frontend-src-pages-productpage-jsx
---
# Design Critique (re-run) — Product page (sellos-frontend-src-pages-productpage-jsx)

Method: dual-agent · Mode: Operate · Route /product/1

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading/sending/toast; success + personalizer validation still toast-only |
| 2 | Match System / Real World | 2 | Dibujito 200-389 + font letter-code shown raw |
| 3 | User Control and Freedom | 3 | Escape + scroll-lock work; Actualizar -> home not cart |
| 4 | Consistency and Standards | 2 | Residual bg-red-600 in personalizers; toFixed prices; two font pickers |
| 5 | Error Prevention | 2 | Qty capped + email regex; empanada blank quote; no logo size/type guard |
| 6 | Recognition Rather Than Recall | 2 | Font needs separate A-Z image; no inline glyph preview |
| 7 | Flexibility and Efficiency | 2 | Desktop sticky good; no mobile sticky bar; no direct qty entry |
| 8 | Aesthetic and Minimalist | 3 | Clean; CTA buried under 4 cross-sells on mobile |
| 9 | Error Recovery | 2 | Modal errors role=alert; personalizer errors toast-only |
| 10 | Help and Documentation | 3 | Useful inline hints |
| Total | | 24/40 | Acceptable (60%) |

Trend: 18 -> 24. Up 6, Poor -> Acceptable. Prior P0 (blue) + most P1 fixed & verified.

## Design Specificity Verdict
Now workshop-authored at commit layer. Blue fully gone (buy #e30613 x9, quote #a30510 x2); deep-red/brand-red = quote vs purchase (intentional); budget modal real a11y pass. Residual generic: font A-Z grid, raw Dibujito number, toFixed prices, and the standout: no mobile buy affordance.
Detector exit 0, zero findings (regex-only). Browser skipped. Verified: sticky lg only (no fixed bottom-0); modal role/aria-modal/labelledby/Escape/scroll-lock/htmlFor+id/close-aria/role=alert present; qty Math.min(99); description guarded x2; ColorPicker aria-label/aria-pressed/focus-visible/check; text-red-500=0; 13 red-500 all focus token.

## What's Working
1. Honest differentiated commit (quote deep-red vs buy brand-red); zero blue.
2. To-scale kit-size preview — workshop-authentic.
3. Budget modal a11y solid (dialog/Escape/scroll-lock/labels/alert); gap: no focus-trap/return.

## Priority Issues
[P0] No mobile buy affordance — action column lg:sticky only (:500); CTA below personalizer + 4 cross-sells on phones. Fix: fixed bottom-0 lg:hidden bar. Command: shape.
[P1] Empanada quote submits blank (:208-210, :291); no sabores requirement. Command: harden.
[P1] Logo upload no size/type guard + createObjectURL never revoked (PersonalizerLogo.jsx:93-105). Command: harden.
[P1] Uploaded logo preview never rendered (stored then discarded ProductPage.jsx:335). Command: shape.
[P2] Font 27-btn grid + kit buttons no focus ring/aria-pressed/radiogroup (Personalizer.jsx:105-147, PersonalizerLogo.jsx:145-157). Command: harden.
[P2] Actualizar -> home not cart (:270). Command: shape.
[P2] Personalizer active states bg-red-600 x4 not #e30613. Command: colorize.
[P3] Prices toFixed not es-AR (adapt); cross-sell above CTA (distill); unused Heart import; duplicated description block.

## Persona Red Flags
Casey: buy/quote CTA never pinned on phones (sticky lg only) — worst issue.
Riley: empanada blank-quote allowed; logo unguarded + leaks; qty capped (good); add-to-cart not debounced.
Sam: modal + swatches correct; font/kit buttons still no focus/aria-pressed; gallery thumbs + qty stepper no labels/aria-live; modal no focus-trap/return.

## Minor Observations
Fuente value diverges (Sin preferencia vs sin-preferencia); 200=sin dibujito sentinel; duplicated description block; inline fadeIn <style>.

## Questions to Consider
1. If phones start most orders, why is the buy decision lg:-only sticky?
2. Show the empty kit box to scale but discard the uploaded logo preview — why?
3. Would a counter clerk say "letter Q" or show samples? What's the A-Z grid optimizing for?
