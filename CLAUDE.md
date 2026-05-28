# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ProjectInBio is a Brazilian Portuguese ("pt-BR") link-in-bio platform where users create profiles with social links, custom links, and project showcases. Built with Next.js 15 App Router, Firestore, and NextAuth.

## Commands

Package manager: **pnpm**

```bash
pnpm dev             # Start dev server
pnpm build           # Production build
pnpm lint            # ESLint check
pnpm lint:fix        # ESLint auto-fix
pnpm type-check      # TypeScript type checking (tsc --noEmit)
pnpm format          # Prettier format all files
pnpm format:check    # Prettier check formatting
```

## Architecture

**Next.js 15 App Router** with Server Components by default and Server Actions for mutations.

- `src/app/actions/` — Server Actions (`'use server'`): all write operations (create project, update profile, manage links, track visits) — see [src/app/actions/CLAUDE.md](src/app/actions/CLAUDE.md)
- `src/app/server/` — Server-side read-only data fetching functions — see [src/app/server/CLAUDE.md](src/app/server/CLAUDE.md)
- `src/app/(pages)/` — Route group: landing page (`page.tsx`), profile pages (`[profileId]/`), link creation (`criar/`), upgrade flow (`[profileId]/upgrade/`) — see [src/app/(pages)/CLAUDE.md](<src/app/(pages)/CLAUDE.md>)
- `src/app/api/` — Route Handlers: NextAuth + Stripe checkout/portal/webhook — see [src/app/api/CLAUDE.md](src/app/api/CLAUDE.md)
- `src/components/` — UI primitives, common feature components, landing-page sections — see [src/components/CLAUDE.md](src/components/CLAUDE.md)
- `src/hooks/` — Client-side React hooks — see [src/hooks/CLAUDE.md](src/hooks/CLAUDE.md)
- `src/lib/` — Auth config, Firebase admin init, Stripe init, utilities, app constants — see [src/lib/CLAUDE.md](src/lib/CLAUDE.md)
- `src/middleware.ts` — NextAuth-backed middleware protecting `/criar` and `/:profileId`
- `src/types/` — Ambient type declarations (NextAuth session augmentation)

**Auth**: NextAuth v5 (beta) with Google OAuth provider and `@auth/firebase-adapter`. JWT session strategy. Middleware (`src/middleware.ts`) protects `/criar` and `/:profileId` routes. Session is extended with `user.id` and `user.isTrial` — see `src/types/next-auth.d.ts`.

**Database**: Firestore (NoSQL). Collections: `profiles/{profileId}` with subcollection `projects/{projectId}`. No ORM — direct Firebase Admin SDK calls.

**Storage**: Firebase Cloud Storage for images (avatars, project images). Images compressed client-side before upload (max 0.2MB, 900px for projects, 400px for avatars).

**Payments**: Stripe Checkout (card + boleto) + Billing Portal. Webhook syncs subscription state into `profiles/{profileId}` (`subscriptionStatus`, `stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`). Access gate in `[profileId]/page.tsx`: owners without active subscription (and not in trial) are redirected to `/upgrade`.

**Styling**: Tailwind CSS 4 with `cn()` utility (clsx + tailwind-merge). Dark mode via `next-themes` (atualmente o `<body>` é forçado para `dark` em `layout.tsx`).

## Language

- UI text and user-facing strings: **Portuguese (pt-BR)**
- Code, identifiers, and commit messages: English (except domain terms já em português, como `criar`, `perfil`)
- CLAUDE.md files: Portuguese is acceptable since the audience is the project team

## Subdirectory CLAUDE.md files

Most subdirectories ship a CLAUDE.md with conventions specific to that layer. **Read the relevant subdirectory CLAUDE.md before adding or modifying code** in that area — they contain the obligatory templates (e.g., the `'use server'` skeleton for actions, the webhook signature flow for Stripe).

## Key Patterns

- Profile IDs are sanitized links: normalized, stripped of diacritics, lowercase, alphanumeric + hyphens only (`sanitizeLink` in `lib/utils.ts`)
- Images stored by path in Firestore, signed URLs generated server-side with 1-hour expiry
- Remote images allowed from `storage.googleapis.com` (configured in `next.config.ts`)
- Pricing in BRL (Brazilian Real) — see `lib/config.ts`
- `'use client'` directive only on interactive components (forms, dialogs)

## Environment Variables

```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY_BASE64          # Base64-encoded Firebase private key
FIREBASE_STORAGE_BUCKET
AUTH_SECRET                           # NextAuth JWT secret
AUTH_GOOGLE_ID                        # Google OAuth client ID
AUTH_GOOGLE_SECRET                    # Google OAuth client secret
STRIPE_SECRET_KEY                     # Stripe secret key (sk_test_*)
STRIPE_WEBHOOK_SECRET                 # Stripe webhook signing secret (whsec_*)
NEXT_PUBLIC_STRIPE_PUB_KEY            # Stripe publishable key (pk_test_*)
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID   # Stripe Price ID for monthly plan
NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID    # Stripe Price ID for annual plan
NEXT_PUBLIC_GA_MEASUREMENT_ID         # GA4 measurement ID (G-XXXXXXXXXX)
NEXT_PUBLIC_MIXPANEL_TOKEN            # Mixpanel project token (client SDK)
MIXPANEL_TOKEN                        # Mixpanel project token (server SDK; mesmo valor do NEXT_PUBLIC_*)
GA_API_SECRET                         # GA4 Measurement Protocol API secret (server-only)
RESEND_API_KEY                        # Resend API key (re_*) — envio de e-mails server-side
```

## Git Conventions

- Never add `Co-Authored-By` trailers to commit messages
- Use conventional commits format (e.g., `feat:`, `fix:`, `refactor:`)

## Lint & Format Rules

- ESLint: `next/core-web-vitals`, `next/typescript`, `prettier` integration
- `simple-import-sort` plugin enforces import ordering
- `no-console` rule (warn/error allowed)
- Prettier with `prettier-plugin-tailwindcss` for class sorting
- Path alias: `@/*` maps to `./src/*`
