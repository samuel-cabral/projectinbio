# CLAUDE.md — API Routes

Este diretório contém Route Handlers (REST) do App Router. **Use Route Handlers apenas quando Server Actions não servirem** — ou seja, para webhooks externos e endpoints chamados via `fetch()` do cliente que precisam de uma URL pública.

## Estrutura de rotas

- `auth/[...nextauth]/route.ts` — handler catch-all do NextAuth (`handlers.GET`, `handlers.POST`)
- `stripe/create-checkout/route.ts` — cria Checkout Session (chamado pelo `useCheckout` hook)
- `stripe/create-portal/route.ts` — cria Billing Portal Session (gerenciamento de assinatura)
- `stripe/webhook/route.ts` — recebe eventos do Stripe e sincroniza com Firestore

## Convenções para Route Handlers autenticados

```typescript
import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // ... lógica
  return NextResponse.json({ data })
}
```

- Sempre responder com `NextResponse.json(...)`
- Mensagens de erro em **português** (a UI consome essas mensagens)
- `console.error` ao capturar exceções, mas **nunca devolver `error.stack`** ao cliente
- Validar ownership comparando `profileData.userId === session.user.id`

## Webhook do Stripe — regras críticas

`stripe/webhook/route.ts` é especial e tem regras diferentes dos outros handlers:

- **Não autenticar com `auth()`** — o caller é o Stripe, não o usuário. Em vez disso, validar `stripe-signature` usando `stripe.webhooks.constructEvent(body, signature, secret)`
- **Ler o body como texto cru** (`await request.text()`) — `request.json()` quebra a verificação da assinatura
- **Sempre retornar 200** após processar (ou erro 400 se a assinatura for inválida). Retornar 500 faz o Stripe reenviar o evento
- **`profileId` vem de `metadata`** (`session.metadata?.profileId` ou `subscription.metadata?.profileId`) — sempre passar `profileId` no `metadata` ao criar sessões/assinaturas no Stripe
- Eventos suportados atualmente: `checkout.session.completed`, `checkout.session.async_payment_succeeded/failed`, `customer.subscription.updated`, `customer.subscription.deleted`
- **E-mail do boleto**: em `checkout.session.completed` com `payment_status === 'unpaid'` e `payment_intent` (boleto de pagamento único), busca `next_action.boleto_display_details.hosted_voucher_url` no PaymentIntent e envia o link por e-mail via `sendEmail` de `@/lib/resend`, dentro de `after()` (latência zero; `sendEmail` nunca lança)
- Estado da assinatura é refletido em `profiles/{profileId}.subscriptionStatus` — usado para gate de acesso em `[profileId]/page.tsx`

## Campos Stripe no documento `profiles/{profileId}`

- `stripeCustomerId` — id do customer (criado on-demand no `create-checkout`)
- `stripeSubscriptionId` — id da subscription (apenas planos recorrentes)
- `stripePriceId` — price atual (para diferenciar plano mensal/anual)
- `subscriptionStatus` — `'active' | 'trialing' | 'canceled' | ...` (valores do Stripe). Lógica de acesso usa `'active' | 'trialing'` como liberado

## Métodos de pagamento

Checkout aceita `card` e `boleto`. Boleto expira em 3 dias (`payment_method_options.boleto.expires_after_days`). Pagamento por boleto é confirmado via `checkout.session.async_payment_succeeded`, não `checkout.session.completed`.
