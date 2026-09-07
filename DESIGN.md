---
name: Sellospro
description: Clean, trustworthy Argentine e-commerce for custom stamps — paper-white surfaces, neutral grays, one confident brand red.
colors:
  brand-red: "#e30613"
  accent-red: "#dc2626"
  accent-red-deep: "#b91c1c"
  focus-ring: "#ef4444"
  ink: "#1f2937"
  ink-strong: "#111827"
  text-muted: "#4b5563"
  text-subtle: "#6b7280"
  text-faint: "#9ca3af"
  border: "#d1d5db"
  border-subtle: "#e5e7eb"
  surface: "#ffffff"
  surface-muted: "#f3f4f6"
  app-bg: "#f9fafb"
  success: "#22c55e"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-red-deep}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-dark-hover:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.border-subtle}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.border}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  chip-selected:
    backgroundColor: "{colors.accent-red}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  chip-unselected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  nav-link-active:
    textColor: "{colors.brand-red}"
    typography: "{typography.body}"
---

# Design System: Sellospro

## Overview

**Creative North Star: "The Trusted Workshop Counter"**

Sellospro is the online counter of a real Mar del Plata stamp workshop in business since 1980. The interface should feel like that counter made digital: clean, honest, and unhurried, where a shopkeeper who knows their trade lays your options out on white paper and points — with one confident red mark — to exactly what matters. Nothing is decorated for its own sake. The product (a precisely made custom stamp) is the star; the UI is the calm, legible surface that hands it over without friction.

The system is built on paper-white surfaces (`#ffffff`) floating on a barely-there off-white page (`#f9fafb`), a full neutral-gray ramp for text and structure, and a single brand red (`#e30613`) reserved for action and emphasis. There is no second accent, no gradient scaffolding, no ornament. Corners are gently rounded (mostly 6–8px), shadows are soft and mostly at rest, and hover states lift cards a hair off the page — enough to feel responsive and warm without shouting. It should read as dependable to a professional buyer (an accountant reordering daters) and approachable to a first-timer buying a single school stamp.

The intended character is **warm and approachable**: friendly rounded forms, soft contrast, and generous white space, never a cold or aggressively "salesy" storefront. Red earns attention precisely because it is rare.

**Key Characteristics:**
- Paper-white surfaces on an off-white page; light mode only.
- One brand red, used sparingly for action, price, active, and selected states.
- Full neutral-gray ramp carries all text, borders, and structure.
- System font stack — no web fonts; speed and legibility over typographic flourish.
- Soft, restrained elevation; gentle hover lift on interactive cards.
- Spanish (es-AR) throughout; mobile-first, thumb-friendly.

## Colors

A near-monochrome neutral system punctuated by one decisive red. The red is a signal, not a texture.

### Primary
- **Brand Red** (`#e30613`): The one true Sellospro red — the identity color from the logo era and the primary call-to-action fill. Used for primary buttons, the active/hover destination of the dark "Agregar" button, and anywhere the interface says *this is the action*. This is the canonical value; all red in the product should converge on it.

### Secondary
- **Signal Red** (`#dc2626`, Tailwind `red-600`): The working accent currently applied across most of the UI — the wordmark, active nav links, prices on promotion, "PROMO" tags, selected chips, and the cart badge. Treated as an in-family variant of Brand Red pending convergence onto `#e30613`.
- **Signal Red Deep** (`#b91c1c`, Tailwind `red-700`): The pressed/hover tone for red primary buttons.
- **Focus Red** (`#ef4444`, Tailwind `red-500`): The focus-ring color on inputs and fields.

### Neutral
- **Ink** (`#1f2937`): Primary body text and the dark neutral button ("Agregar", checkout affordances).
- **Ink Strong** (`#111827`): Headings, full-price emphasis, and the selected-swatch border.
- **Text Muted** (`#4b5563`): Secondary text, helper copy, descriptions.
- **Text Subtle** (`#6b7280`): Tertiary text, "Seleccionado:" labels, muted metadata.
- **Text Faint** (`#9ca3af`): Placeholders and inline icons (search glass).
- **Border** (`#d1d5db`): Default input and control borders.
- **Border Subtle** (`#e5e7eb`): Card borders, dropdown edges, dividers.
- **Surface** (`#ffffff`): All cards, panels, header, drawers, inputs.
- **Surface Muted** (`#f3f4f6`): Hover fills, chip resting states, image placeholders.
- **App Background** (`#f9fafb`): The page canvas behind all surfaces.

### Status
- **Success Green** (`#22c55e`, Tailwind `green-500`): Confirmation states only (order success). Not part of the brand palette; reserved for post-payment feedback.

### Named Rules
**The One Red Rule.** Red is the only chromatic voice. If a screen has more than a small fraction of red surface area, something non-essential has been painted red — pull it back to neutral. Red means *act, price, active, or selected*, nothing else.

**The Canonical Red Rule.** `#e30613` is the one true brand red. New work uses `#e30613`; existing `red-600`/`red-700` usage is drift to migrate onto it, not a second red to preserve.

## Typography

**Display / Body / Label Font:** System UI stack (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) — no web font is loaded, by design, for speed and native familiarity.
**Mono Font:** `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` — reserved for order codes / reference numbers.

**Character:** Neutral, legible, unpretentious. The type does no styling work of its own; hierarchy comes from weight and size against generous white space. Warmth comes from spacing and restraint, not from a decorative face.

### Hierarchy
- **Display** (700, `3rem` / `text-5xl`, responsive down to `1.875rem` on mobile, line-height ~1.1): Hero slide headlines only, over darkened photography.
- **Headline** (700, `1.875rem` / `text-3xl`, line-height ~1.2): Page titles (catalog, product name on detail, section headers).
- **Title** (600, `1.125rem`–`1.25rem` / `text-lg`–`text-xl`, line-height ~1.4): Card names, subsection headings, prices in emphasis.
- **Body** (400, `0.875rem`–`1rem` / `text-sm`–`text-base`, line-height ~1.6): Default copy. `text-sm` is the workhorse size across the app.
- **Label** (500, `0.75rem` / `text-xs`): Field labels, helper text, badges, "Sin stock" tags.
- **Mono** (500, `0.875rem`): Order IDs and machine references only.

### Named Rules
**The Weight-Not-Face Rule.** Hierarchy is expressed through weight (400 → 500 → 600 → 700) and size, never through a decorative or contrasting typeface. There is one family; it does everything.

## Layout

Centered single-column-of-sections model. Content sits in a `max-w-7xl` (1280px) container with responsive gutters (`16px` mobile → `24px` → `32px` desktop). Narrower reading and form contexts step down to `max-w-4xl` / `max-w-3xl` / `max-w-xl`.

The app shell is a flex column with a sticky header (`h-16`), a `flex-1` main, and a footer pinned to the bottom, all on the `#f9fafb` canvas. Catalog uses a responsive product grid of white cards. Spacing follows a 4px base rhythm; common steps are `8px` / `16px` / `24px` / `32px`, with `space-y-4` (16px) as the default vertical rhythm inside forms and personalizers.

Mobile-first throughout: the Hero is full-bleed and swipeable, navigation collapses into a right-side slide-in drawer, and touch targets (chips, swatches, buttons) stay at or above ~36–40px.

## Elevation & Depth

Soft and mostly at rest. Surfaces are white cards on an off-white page, separated first by a hairline border (`#e5e7eb`) and only secondarily by shadow. Depth is a response to interaction, not a permanent decoration.

### Shadow Vocabulary
- **Resting** (`shadow-sm`): Cards, the sticky header, and dropdowns at rest — a faint lift that separates surface from canvas.
- **Raised** (`shadow-lg`): Product cards on hover, search-preview and menu overlays — a clear but soft elevation.
- **Overlay** (`shadow-xl` / `shadow-2xl`): The mobile navigation drawer and modal-like layers above the dimmed (`bg-black/50`) scrim.

### Named Rules
**The Border-First, Shadow-Second Rule.** Separation is a `1px` neutral border by default; shadow is added to signal elevation or interactivity, not to decorate a static box.

**The Lift-On-Hover Rule.** Interactive cards rise on hover (`shadow-sm → shadow-lg` plus a `-4px` translate) and their image zooms subtly (`scale-1.05`). Non-interactive surfaces stay flat.

## Shapes

Gently rounded, warm but not soft-toy. The radius vocabulary:
- **`4px` (`rounded-sm` / `rounded`):** Selection chips (font letters), small tags.
- **`6px` (`rounded-md`):** Inputs, textareas, and search-result thumbnails — the default field radius.
- **`8px` (`rounded-lg`):** Buttons, product cards, dropdowns, panels — the default surface radius.
- **`12px` (`rounded-xl`):** Occasional larger feature panels.
- **`9999px` (`rounded-full`):** Pills and circles — the search input, cart badge, carousel dots, and color swatches.

Borders are `1px`, neutral, and quiet. Circular forms (swatches, badge, dots) are the system's one recurring geometric motif and echo the round rubber of a stamp.

## Components

Components are **warm and approachable**: legible, gently rounded, with soft feedback. Red appears only on action and selection.

### Buttons
- **Shape:** Rounded (`8px` / `rounded-lg`), except the Hero CTA which is a full pill.
- **Primary (Red):** `#e30613` fill, white text, `12px 24px` padding. The main commit action (checkout, submit, add-to-cart on the product page). Hover deepens toward `#b91c1c`. Disabled: neutral gray fill (`#9ca3af`), `not-allowed` cursor.
- **Dark Neutral ("Agregar"):** `#1f2937` fill, white text, `rounded-lg`, `8px 16px`. Used on product cards; **hovers to Brand Red `#e30613`** — a small, characteristic dark→red transition.
- **Secondary ("Personalizar y Cotizar"):** `#e5e7eb` fill, `#1f2937` text, `rounded-lg`. Hover to `#d1d5db`. Used for the quote-first path.
- **Hero CTA:** White pill (`rounded-full`), black text, over darkened photography; hover to `#e5e7eb`.
- **Transitions:** ~200–300ms color/transform; standard easing.

### Chips (font & selection)
- **Style:** Small squares (`w-9 h-9`, `rounded` 4px) with a `1px` border.
- **Unselected:** White fill, `#d1d5db` border, hover fills `#f3f4f6`.
- **Selected:** `#dc2626` (→ converge to `#e30613`) fill, white text, matching red border.

### Color Swatches (signature)
- **Style:** `40px` circles (`rounded-full`), `2px` border, background = the actual ink color.
- **Selected:** `#111827` border ring; hover softens to `#6b7280`.
- **Out of stock:** `opacity-40`, `not-allowed`, with a small red "Sin stock" label beneath.

### Cards / Containers
- **Corner:** `8px` (`rounded-lg`).
- **Background:** White (`#ffffff`) on the `#f9fafb` canvas.
- **Border:** `1px` `#e5e7eb`, with an inner `#f3f4f6` divider between image and body.
- **Shadow:** `shadow-sm` at rest → `shadow-lg` on hover (see Elevation).
- **Image:** `aspect-square`, `object-cover`, `scale-1.05` zoom on hover.
- **Padding:** `16px`.

### Inputs / Fields
- **Style:** White fill, `1px` `#d1d5db` border, `6px` radius (`rounded-md`), `8px 12px` padding, `text-sm`.
- **Focus:** `focus:ring-1` in Focus Red (`#ef4444`); the search input rings `currentColor` and is a full pill.
- **Textarea:** Same treatment, `resize-none`.
- **Checkbox:** `20px`, red accent (`#dc2626`), red focus ring.

### Navigation
- **Header:** Sticky, white, `shadow-sm`, `h-16`. Wordmark "Sellospro" in `text-2xl` bold Brand Red.
- **Links:** `font-medium`, `#1f2937` default → Brand Red on hover; **active link is Brand Red**.
- **Cart:** Icon button with a circular red badge (white count) when items exist.
- **Mobile:** Right-side slide-in drawer (`w-4/5`, `max-w-sm`, `shadow-xl`) over a `bg-black/50` scrim; links stack at `text-lg`.

### Hero Carousel (signature)
Full-bleed swipeable slider (`60vh` mobile → fixed desktop height) with a `bg-black/50` overlay for text legibility, 1s cross-fade between slides, auto-advance every 5s, and white circular dot navigation.

## Do's and Don'ts

### Do:
- **Do** keep surfaces white (`#ffffff`) on the `#f9fafb` canvas; reach for neutral grays before any color.
- **Do** use `#e30613` as the single, canonical brand red for all new work, and migrate existing `red-600`/`red-700` usage toward it.
- **Do** reserve red for action, price, active, and selected states — keep its screen share small so it stays a signal.
- **Do** separate surfaces with a `1px` neutral border first, adding soft shadow only for elevation or hover.
- **Do** lift interactive cards gently on hover (`shadow-lg` + `-4px` translate, `scale-1.05` image) and keep everything else flat.
- **Do** lean on weight and size within the one system font for hierarchy; keep copy in Spanish (es-AR).
- **Do** keep touch targets thumb-friendly (~36–40px) and forms on the 4px / 16px vertical rhythm.

### Don't:
- **Don't** introduce a second accent color, gradients-as-decoration, or a web/display font — the system is deliberately near-monochrome and system-typeset.
- **Don't** paint large areas red or use red for non-actionable emphasis; a red-heavy screen is a defect.
- **Don't** ship a dark theme or dark surfaces for content — the product is committed to light mode (`color-scheme: light`).
- **Don't** over-round into pill-shaped buttons for standard actions (pills are reserved for the search field, badges, dots, and the Hero CTA).
- **Don't** stack heavy shadows on resting surfaces or add ornament to cards; restraint is the brand.
- **Don't** collapse the two purchase paths — keep the red "commit" button for instant-buy and the neutral secondary button for the quote-first ("Cotizar") flow visually distinct.
