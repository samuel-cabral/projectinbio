# CLAUDE.md — Analytics

Módulo de telemetria do ProjectInBio. Combina **GA4** (gratuito, agregado) e **Mixpanel** (funis, perfis) com tracking **client-side e server-side** para resistir a ad-blockers.

## Arquitetura

- `events.ts` — fonte única de verdade. Define `EVENTS` (constantes) e `EventMap` (discriminated union dos payloads). Trocar nome de evento ou propriedade vira erro de TypeScript em qualquer call site.
- `types.ts` — tipos compartilhados (`UserIdentity`, `TrackOptions`) e re-exports de `events.ts`.
- `server.ts` — `'server-only'`. Lazy singleton do Mixpanel Node SDK + GA4 Measurement Protocol via `fetch`. Exporta `trackServer()`, `identifyServer()`.
- `client.ts` — `'use client'`. mixpanel-browser + `sendGAEvent` de `@next/third-parties/google`. Exporta `initClientAnalytics()`, `identifyClient()`, `trackClient()`, `trackPageview()`.
- `index.ts` — barrel **server-only** (importa `server.ts`). Client code não pode importar daqui — use `@/lib/analytics/client` direto.

## Quando usar `trackServer` vs `trackClient`

| Cenário | Use |
|---|---|
| Conversões (signup, profile_created, subscription_started, payment_*) | `trackServer` — eventos críticos, ad-blocker-proof |
| Cliques em links externos (social, custom, project) | `trackServer` via server action — bypassa ad-blockers |
| Page views, interações UI sem mutação (clique em botão de plano) | `trackClient` — contexto de sessão |
| NextAuth `events.createUser` / `events.signIn` | `trackServer` direto com `await` + try/catch (NOT `after()` — não há request scope confiável) |
| Stripe webhook (`api/stripe/webhook/route.ts`) | `trackServer` dentro de `after()` — ack rápido para Stripe + delivery garantida |
| Server actions (`src/app/actions/*`) | `trackServer` dentro de `after()` — latência zero para o usuário |

## Como adicionar um evento novo

1. Adicione a constante em `EVENTS` (`events.ts`)
2. Adicione o tipo do payload em `EventMap` (`events.ts`) com chave `[EVENTS.X]`
3. Use `trackServer(EVENTS.X, { ...payload }, { userId })` ou `trackClient(EVENTS.X, { ...payload })` no call site
4. TypeScript valida automaticamente nome + payload

## Variáveis de ambiente

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — formato `G-XXXXXXXXXX` (GA4 dashboard)
- `NEXT_PUBLIC_MIXPANEL_TOKEN` — Mixpanel project token (browser)
- `MIXPANEL_TOKEN` — Mixpanel project token (server; mesmo valor)
- `GA_API_SECRET` — GA4 Admin > Data Streams > Measurement Protocol API secrets

**Sem essas vars, o módulo entra em no-op silencioso** (warn no boot, mas não quebra). Útil em dev sem keys configuradas.

## GA4 Measurement Protocol — endpoints

- Produção: `https://www.google-analytics.com/mp/collect?measurement_id=...&api_secret=...`
- Dev (validação): `https://www.google-analytics.com/debug/mp/collect?...` — retorna `validationMessages` no body
- Limites: máx 25 eventos por request, payload <130kB

## Padrões obrigatórios

- **Falhas de analytics nunca quebram user flow**: todas as chamadas server-side em try/catch com `console.error`
- **`after()` é o padrão** em Server Actions e Route Handlers — latência zero para o usuário
- **Exceções ao `after()`**: NextAuth events (sem request scope confiável) → usar `await` + try/catch direto
- **Identify**: dispara no `events.createUser` do NextAuth (server) e em todo conversão Stripe; client identifica no mount via `AnalyticsProvider`
- **PII**: `email`/`name` só vão para Mixpanel via `people.set` (nunca em propriedades de evento; GA4 nunca recebe PII)

## Componentes relacionados

- `src/components/analytics/analytics-provider.tsx` — inicializa Mixpanel browser + identifica usuário (montado no root layout)
- `src/components/analytics/analytics-pageview.tsx` — dispara `trackPageview` em mudança de rota (em `<Suspense>` por causa do `useSearchParams`)
- `src/components/common/user-card/tracked-link.tsx` — wrapper de `<Link>` que chama `trackLinkClick()` server action antes de navegar (fire-and-forget, `target="_blank"` garante delivery)
