# Nexus — SaaS Landing Page

A production-ready SaaS landing page built with Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, and TypeScript. Inspired by the design language of Stripe, Vercel, and Linear.

---

## Project Overview

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with semantic design tokens
- **Animations**: Framer Motion — scroll-triggered fade-ins, hover effects, accordion transitions
- **Theme**: Dark/light mode via `next-themes` (persists to localStorage, respects system preference)
- **Font**: Inter (headings + body), Geist Mono (code/mono)
- **Icons**: Lucide React

### Sections

| Section | Component |
|---|---|
| Sticky Navbar + mobile menu | `components/navbar.tsx` |
| Hero (headline, CTA, terminal) | `components/sections/hero.tsx` |
| Trusted-by logos | `components/sections/logos.tsx` |
| Features grid | `components/sections/features.tsx` |
| How It Works (3-step) | `components/sections/how-it-works.tsx` |
| Pricing (3 tiers, toggle) | `components/sections/pricing.tsx` |
| Testimonials (masonry grid) | `components/sections/testimonials.tsx` |
| FAQ (accordion) | `components/sections/faq.tsx` |
| CTA banner | `components/sections/cta.tsx` |
| Footer | `components/footer.tsx` |
| Scroll progress indicator | `components/scroll-progress.tsx` |

---

## Installation

### Using the shadcn CLI (recommended)

```bash
npx shadcn@latest init
```

### Manual setup

```bash
git clone <repo-url> nexus-landing
cd nexus-landing
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Customizing Content

All copy, links, and data live in **`config/site.ts`** — no hunting through component files.

```ts
// config/site.ts

export const siteConfig = {
  name: "Nexus",           // ← Change your brand name
  tagline: "...",          // ← Hero tagline
  description: "...",      // ← Meta description + hero subtext
  url: "https://nexus.app",
  links: { twitter: "...", github: "..." },
}

export const features = [...]       // Feature cards
export const steps = [...]          // How It Works steps
export const pricingPlans = [...]   // Pricing tiers
export const testimonials = [...]   // Testimonial cards
export const faqs = [...]           // FAQ accordion items
export const footerLinks = { ... }  // Footer column links
export const trustedLogos = [...]   // Trusted-by logos
```

---

## Adding New Sections

1. Create `components/sections/my-section.tsx`
2. Export a named component (e.g. `MySection`)
3. Import and render it in `app/page.tsx`

Use the existing wrappers for consistency:

```tsx
import { Section, Container, SectionHeader } from "@/components/section"
import { FadeIn } from "@/components/fade-in"

export function MySection() {
  return (
    <Section id="my-section">
      <Container>
        <FadeIn>
          <SectionHeader eyebrow="Label" title="Section title" />
        </FadeIn>
        {/* content */}
      </Container>
    </Section>
  )
}
```

---

## Changing Theme and Colors

Colors are defined as CSS custom properties (design tokens) in `app/globals.css`.

The primary brand color is a single token:

```css
:root {
  --primary: oklch(0.55 0.22 255);   /* electric blue — light mode */
}
.dark {
  --primary: oklch(0.65 0.22 255);   /* slightly brighter in dark */
}
```

Change the `255` hue value to shift the accent color across the spectrum (e.g., `140` = green, `30` = orange).

---

## Deployment (Vercel)

The project is Vercel-ready with zero configuration.

1. Push to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — click **Deploy**.

Or deploy instantly from v0 using the **Publish** button in the top-right of the editor.
