# CLAUDE.md — Hooks

Hooks customizados React (client-side). Reservado para lógica reutilizável compartilhada por múltiplos componentes.

## Convenções

- Sempre marcar com `'use client'` no topo
- Nomenclatura: `use-kebab-case.ts` (arquivo), `useCamelCase` (export)
- Use `useCallback`/`useMemo` em valores retornados para evitar re-renders desnecessários nos consumidores
- Para fluxos que chamam Route Handlers (`/api/...`):
  - Tratar `!response.ok` separadamente de `try/catch`
  - `console.error` com prefixo descritivo em pt-BR
  - Em redirects externos (Stripe), usar `window.location.href = url` (não `router.push`)

## Hooks atuais

- `use-checkout.ts` — encapsula chamadas a `/api/stripe/create-checkout` e `/api/stripe/create-portal`. Retorna `{ checkout(priceId, profileId), handleCreateStripePortal(), isLoading }`

## Quando NÃO criar um hook

- Se a lógica é usada em um único componente → mantenha inline
- Se a lógica é puramente server-side → use função em `@/app/server/` ou `@/lib/`
- Se é uma mutação → use Server Action em `@/app/actions/` (com `useTransition` no consumidor se precisar de pending state)
