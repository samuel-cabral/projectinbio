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

- `src/app/actions/` — Server Actions (`'use server'`): all write operations (create project, update profile, manage links, track visits)
- `src/app/server/` — Server-side read-only data fetching functions
- `src/app/(pages)/` — Route group: landing page (`page.tsx`), profile pages (`[profileId]/`), link creation (`criar/`)
- `src/app/api/auth/` — NextAuth API route handler
- `src/components/ui/` — shadcn/ui base components (button, dialog, input, textarea)
- `src/components/common/` — Feature components (project cards, user card with edit dialogs, visit counters)
- `src/components/landing-page/` — Landing page sections
- `src/lib/` — Auth config, Firebase admin init, utilities, app constants

**Auth**: NextAuth v5 (beta) with Google OAuth provider and `@auth/firebase-adapter`. JWT session strategy. Middleware protects `/criar` and `/:profileId` routes.

**Database**: Firestore (NoSQL). Collections: `profiles/{profileId}` with subcollection `projects/{projectId}`. No ORM — direct Firebase Admin SDK calls.

**Storage**: Firebase Cloud Storage for images (avatars, project images). Images compressed client-side before upload (max 0.2MB, 900px for projects, 400px for avatars).

**Styling**: Tailwind CSS 4 with `cn()` utility (clsx + tailwind-merge). Dark mode via `next-themes`.

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
