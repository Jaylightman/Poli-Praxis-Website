# Poli-Praxis — Design System (MASTER)

> Global Source of Truth for the Poli-Praxis multi-office website.
> Derived from the brand of www.poli-praxis.info and the Poli-Praxis "PP" logo (teal + gray).
> Page-specific overrides live in `design-system/pages/<page>.md` — if a page file exists, it wins.

---

## 1. Brand Essence

- **Claim:** „Medizin von Mensch zu Mensch" (Medicine from person to person)
- **Personality:** trustworthy, calm, human, professional, accessible
- **Model:** One brand, many offices. Every office is named **"Poli-Praxis …"** + its location
  (e.g. *Poli-Praxis München Mitte*, *Poli-Praxis München Nord*, *Poli-Praxis Augsburg*).
- **Style:** "Accessible & Ethical" (WCAG-first, high contrast, calm surfaces, no visual noise)
- **Wordmark:** two-tone — „Poli" in `#666666` (`.brand-poli`), „Praxis" in `#3BAFBF` (`.brand-praxis`). Applies to every visible brand mention on light backgrounds (header, headings, office names). On teal surfaces (hero, page-hero, CTA band, footer) the wordmark stays white — the two-tone colors are unreadable on `#3BAFBF`.

## 2. Color Tokens

Colors are taken from the PP logo (two-tone teal + neutral gray). Never use raw hex in components — use the CSS variables.

| Role                | Token                  | Hex       | Usage |
|---------------------|------------------------|-----------|-------|
| Primary (Teal)      | `--pp-teal`            | `#3BAFBF` | CTAs, links, icons, **all dark surfaces: hero, page-hero, CTA band, footer** |
| Primary dark        | `--pp-teal-dark`       | `#257684` | Hover states, text links |
| Primary deep        | `--pp-teal-deep`       | `#14525C` | Text on light teal chips, button text on white |
| Teal night          | `--pp-teal-night`      | `#1C4A5C` | Footer bg — dark petrol, hue-matched to `#3BAFBF` (bluer, not green) |
| Teal tint (surface) | `--pp-teal-tint`       | `#E7F5F7` | Section backgrounds, chips |
| Brand Gray          | `--pp-gray`            | `#54565A` | Logo gray, secondary buttons, subheads |
| Ink (text)          | `--pp-ink`             | `#26282C` | Headings, body text |
| Muted text          | `--pp-text-muted`      | `#5C6066` | Descriptions, meta info (4.5:1 on white) |
| Background          | `--pp-bg`              | `#FFFFFF` | Page background |
| Surface             | `--pp-surface`         | `#F6FAF9` | Cards on white, alternating sections |
| Border              | `--pp-border`          | `#D3E7EA` | Card borders, dividers |
| Focus ring          | `--pp-ring`            | `#3BAFBF` | 3px visible focus outline |
| Destructive         | `--pp-danger`          | `#C4342D` | Errors only |

**Rules**
- Text on white: only `--pp-ink` or `--pp-text-muted` (≥ 4.5:1).
- White text only on `--pp-teal-dark`/`--pp-teal-deep`/`--pp-gray` (≥ 4.5:1). On `--pp-teal` only for large/bold text (≥ 3:1).
- Anti-patterns: no neon colors, no purple/pink AI gradients, no pure black `#000`.

## 3. Typography

| Layer    | Font       | Weights          | Notes |
|----------|-----------|------------------|-------|
| Headings | **Figtree** | 600, 700        | Geometric-humanist, friendly-professional |
| Body     | **Noto Sans** | 400, 500, 700 | Excellent multilingual support (DE/EL/RU…) |

```css
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700&family=Noto+Sans:wght@400;500;700&display=swap');
```

**Type scale (px):** 14 (meta) · 16 (body, base) · 18 (lead) · 20 (h4) · 24 (h3) · 32 (h2) · 40–52 (h1, clamp).
Line-height: 1.6 body, 1.15 headings. Max line length ~70ch.

## 4. Layout

- **Container:** max-width 1160px, gutters 20px (mobile) / 32px (≥768px)
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96
- **Grid:** office cards 1-col (mobile) → 2-col (≥700px) → 3-col (≥1024px)
- **Radius:** 12px cards, 8px buttons/inputs, 999px chips
- **Shadow scale:** `sm` 0 1px 2px rgba(20,82,92,.06) · `md` 0 6px 24px rgba(20,82,92,.10) — never random shadows
- **Breakpoints:** 375 / 700 / 1024 / 1440

## 5. Core Components

- **Header:** sticky, white, subtle bottom border. Logo left, nav center/right, teal CTA "Termin buchen". Mobile: hamburger → slide-down panel.
- **Office card (homepage):** image (16:10, duotone illustration/photo) → office name (`Poli-Praxis <Ort>`) → location pin + address → 2-line description → specialty chips (max 4 + "+n") → teal text-link "Standort ansehen →". Whole card clickable, visible focus ring.
- **Doctor card:** initials-avatar (teal/gray), name, specialty, location tags. Multi-office doctors show all their location tags.
- **Specialty card (homepage):** icon + name + description + **location tags** (same chips as doctor cards, above a subtle divider) showing every office where the specialty is offered. Keep tags in sync with office pages and doctor rosters.
- **Chips:** teal-tint bg, teal-deep text, pill radius.
- **Buttons:** primary = brand teal `#3BAFBF` bg / white text, hover darkens to `--pp-teal-dark`; secondary = white bg, teal border/text; both ≥44px tall, hover 150–250ms ease-out, `cursor:pointer`. Exception: buttons sitting on teal surfaces (hero, CTA band) stay white with teal text so they remain visible.
- **Footer:** dark petrol (`--pp-teal-night` `#1C4A5C`) bg, white text: 3 office columns (address, phone), legal links (Impressum, Datenschutz), claim. Hero, page-hero and CTA band use solid brand teal `#3BAFBF` (white-on-teal is a deliberate brand choice at ~2.6:1 contrast).
- **Map embed (office pages):** `.map-embed[data-map-query]` — the Google Maps iframe is injected automatically by JS on page load (lazy-loaded); the placeholder (pin icon + "In Google Maps öffnen" link) is the no-JS/loading fallback. Note: auto-loading transmits visitor data to Google on page view — if GDPR consent flow is ever required, restore click-to-load.

## 6. Imagery

- Office images: duotone (teal/gray) skyline illustrations or photos of local landmarks (matches original site's Munich landmark photography).
- Doctors: real photos when available; until then initials-avatars — never stock faces.
- Icons: single set, stroke style (Lucide-like), 1.75px stroke, 24px grid, `currentColor`. **Never emoji.**

## 7. Motion (dynamic layer)

- Micro-interactions 150–300ms, ease-out in / ease-in out; transform+opacity only.
- Card hover: translateY(-3px) + shadow `md`; office-card images zoom to 1.05 on hover.
- **Scroll-reveal:** sections/cards rise in via IntersectionObserver (`.reveal` → `.is-visible`), 70ms stagger per grid row; only active when JS runs (`html.js`).
- **Hero:** staggered entrance (h1 → lead → actions → stats) + slow floating background accents; stats animate 0→n with ease-out cubic counters.
- **Live status:** `.status-badge[data-open-status=<slug>]` filled by JS from `OFFICE_HOURS` in main.js — "Jetzt geöffnet · bis …" (pulsing dot) or "Geschlossen · öffnet …". Update hours there when they change.
- Sticky header gains shadow after 8px scroll; injected back-to-top button after 600px; doctor filter results pop in.
- Everything respects `prefers-reduced-motion` (global kill switch + JS checks).

## 8. Accessibility (non-negotiable)

- Contrast ≥ 4.5:1 body / 3:1 large text; visible 3px focus rings; skip-link; semantic headings h1→h6 without skips; `lang="de"`; alt text on all meaningful images; touch targets ≥ 44×44px; no color-only meaning (pin icon + text for locations).

## 9. Content Model

```
Office (Standort)
├─ slug, name ("Poli-Praxis <Ort>"), shortDescription
├─ address, phone, fax, email, mapsUrl
├─ openingHours[]
├─ specialties[]  (shared or office-specific)
└─ doctors[]      (a doctor may belong to multiple offices)
```

Current offices: **München Mitte** (Herzog-Wilhelm-Str. 17) · **München Nord** (Wundtstr. 15) · **Augsburg** (Kurhausstr. 1).

## 10. Page Map

- `index.html` — Hero (claim + stats) → **Standorte grid (photo, description, location)** → Fachrichtungen → Ärzte-Teaser → CTA → Footer
- `standort-<slug>.html` — Office hero (**location-specific art**: `.page-hero--<slug>` blends the city illustration behind the title via `.page-hero__art` + teal gradient overlay; full-width tinted at <700px) → contact/hours/map cards → specialties → team → CTA
- `aerzte.html` — all doctors, filterable by office; multi-office doctors appear under every office filter
