# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two confirmed primary audiences, served by the same storefront:

- **Small businesses & professionals** — accountants, doctors, lawyers, shops, schools, and similar. They buy automatic stamps, daters (fechadores), numberers (numeradores), inks, and made-to-order logo kits for recurring operational use, and value correct text/layout and reliable resupply.
- **Individuals / general public** — people wanting a single personalized stamp (school, crafts, personal, gifts, novelty like the "empanadas" stamp) as a one-off purchase.

Both are shopping online, largely from Argentina (Spanish, es-AR), and often on mobile. The store must read as trustworthy to a business buyer while staying approachable for a first-time individual.

## Product Purpose

Sellospro is the online store of a Mar del Plata stamp manufacturer (in business since 1980) that lets customers design, personalize, and buy custom stamps end-to-end on the web. Success is a completed, correctly-personalized order paid through MercadoPago — or, for logo kits, a submitted budget request that reaches the workshop with the customer's logo attached.

## Positioning

What a neighboring stamp seller could not truthfully copy without matching all three:

- **Full self-service online personalization.** The customer configures the exact stamp on the page — text, lines, font, ink color, size — and checks out end-to-end. Most of this trade still runs in-person or quote-by-quote; doing the whole flow online is the differentiator.
- **Local manufacturer, fast and regional.** A real Mar del Plata workshop (established 1980), not a reseller — trust of an actual maker with fast regional turnaround and delivery.
- **Breadth plus custom logo kits.** A wide catalog (automatic, daters, numberers, portable, inks, pads, school, novelty) combined with made-to-order logo kits handled through a budget-request flow.

## Operating Context

- **Catalog & filtering** — browse by category, sort by price/name, live search preview in the header.
- **Three in-page personalizers, chosen by product category:** standard text personalizer, school personalizer, and a logo personalizer; plus a novelty variant (empanadas). Configuration covers text lines, font, and ink color, with per-product rules (e.g. `requiresPad`, `requiresDiluent`, `maxLines`).
- **Cart** — persistent global cart (React Context + localStorage) that groups identical product+customization; clicking a cart item reopens the product page with its customizations preloaded for editing.
- **Two purchase paths:**
  - *Buy now* — standard/school/automatic products go through checkout → MercadoPago preference → payment. Confirmed orders are persisted server-side and trigger SendGrid confirmation emails to customer and admin; post-payment `/success`, `/failure`, `/pending` states; an `/order/:orderId` status page linked from the email.
  - *Budget request* — logo-kit products let the customer pick a kit size, upload their own logo, and submit a request; the backend emails the admin the details plus the attached logo for manual quoting.
- **Product categories (terminology):** Automáticos, Fechadores, Numeradores, Portátiles, Tintas, Almohadillas, Escolar, Kits (logo), KitEmpanadas, Otros. Products carry stock levels and can go out of stock.

## Capabilities and Constraints

- **Stack (authority is the codebase, `sellos/`):** React 18 + Vite + Tailwind CSS + React Router v6, React Context for state, Lucide icons. Backend Node/Express with MercadoPago SDK (payments + webhooks), SendGrid (transactional email), Multer (logo uploads). Products served from `products.json`; confirmed orders stored as JSON files server-side.
- **No user accounts / no auth.** Purchases and order lookups are anonymous; order status is reached via a per-order URL. There is no customer login and no in-app admin UI — administration happens via email notifications and the products/orders files.
- **Payment is MercadoPago-only**, tied to Argentina; copy, currency, and flows assume es-AR.
- **Logo kits are not instant-buy** — they are quote-first by design; future work must preserve that a logo kit ends in a budget request, not an immediate charge.
- **Webhooks require a public backend URL** in production; local testing uses a tunnel (e.g. ngrok).

## Brand Commitments

- **Name & mark:** "Sellospro" (styled "Sellospro®" — treated as a registered trademark). Do not rename or restyle the mark.
- **Established 1980** — legacy/heritage is a genuine, usable trust signal ("Sellos desde 1980").
- **Locale & voice:** Spanish, es-AR, Mar del Plata. All customer-facing copy is Spanish; keep it clear and trustworthy for business buyers without becoming stiff for individuals.
- **Assets:** logo at `public/LogoSellos.jpg`; production domain `sellospro.com.ar`.
- **Channels:** Instagram and Facebook `@sellospro`, and a WhatsApp contact channel. (Exact phone/WhatsApp number should be verified against production — some numbers in the current code appear to be placeholders.)

## Evidence on Hand

- **Real product photography exists and may be used** — actual catalog/product imagery (`image`, `thumbnails` per product).
- **Heritage claim is real:** in business since 1980.
- **No testimonials, reviews, ratings, case studies, or customer logos exist yet.** Future design work must NOT fabricate social proof, star ratings, review counts, or named customers. If proof is needed, request real content or use the genuine heritage/locality signals instead.

## Product Principles

1. **Correctness of the personalization is the product.** The stamp the customer configures must be exactly what they see and get; the personalizers and cart-edit flow are the core value, not decoration.
2. **Two buyers, one store.** Stay credible to a professional/business buyer and approachable to a first-timer — never optimize one into alienating the other.
3. **Preserve the two-path model.** Instant-buy for standard products; quote-first budget request for logo kits. Don't collapse them.
4. **Trust through being a real, local maker.** Lean on the 1980 heritage, Mar del Plata locality, and real product photos — not invented social proof.
5. **Anonymous, low-friction commerce.** No accounts; keep the path from catalog → personalize → pay short and resilient (order lookup by URL, clear post-payment states).

## Accessibility & Inclusion

No formal standard was established as a binding requirement. Baseline expectation: es-AR language correctness, mobile-first responsive behavior (already a project goal), and legible personalizer/color controls. Treat WCAG AA contrast and keyboard operability as the working default for future work unless the user sets a stricter target.
