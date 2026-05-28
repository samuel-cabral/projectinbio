import { headers } from 'next/headers'
import { after, NextResponse } from 'next/server'
import type Stripe from 'stripe'

import { EVENTS, identifyServer, trackServer } from '@/lib/analytics'
import { db } from '@/lib/firebase'
import { sendEmail } from '@/lib/resend'
import { stripe } from '@/lib/stripe'

type StripeMetadata = { profileId?: string; userId?: string }

function readMetadata(metadata?: Stripe.Metadata | null): StripeMetadata {
  return {
    profileId: metadata?.profileId,
    userId: metadata?.userId,
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET!

  if (!signature || !secret) {
    return NextResponse.json({ error: 'Assinatura ou secret ausente' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (error) {
    console.error('Erro na verificação do webhook:', error)
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const { profileId, userId } = readMetadata(session.metadata)
      if (!profileId) break

      const subscriptionId = session.subscription as string | null

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0]?.price.id ?? null
        await db
          .collection('profiles')
          .doc(profileId)
          .update({
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            subscriptionStatus: subscription.status,
          })

        if (userId) {
          const amountBrl = (session.amount_total ?? 0) / 100
          after(async () => {
            await identifyServer({ userId, isTrial: false })
            await trackServer(
              EVENTS.SUBSCRIPTION_STARTED,
              {
                userId,
                profileId,
                priceId: priceId ?? '',
                amountBrl,
                subscriptionId,
              },
              { userId }
            )
            await trackServer(
              EVENTS.PAYMENT_SUCCEEDED,
              { userId, profileId, method: 'card', amountBrl },
              { userId }
            )
          })
        }
      } else if (session.payment_status === 'paid') {
        // Pagamento único (ex: plano vitalício)
        await db
          .collection('profiles')
          .doc(profileId)
          .update({
            stripeCustomerId: session.customer as string,
            subscriptionStatus: 'active',
          })

        if (userId) {
          const amountBrl = (session.amount_total ?? 0) / 100
          after(async () => {
            await identifyServer({ userId, isTrial: false })
            await trackServer(
              EVENTS.PAYMENT_SUCCEEDED,
              { userId, profileId, method: 'card', amountBrl },
              { userId }
            )
          })
        }
      } else if (session.payment_status === 'unpaid' && session.payment_intent) {
        // Só chega aqui em pagamento único com boleto: sem `subscriptionId` (cai
        // do `if` acima) e ainda não pago. O voucher já foi gerado — enviamos o
        // link por e-mail para o cliente concluir o pagamento.
        const customerEmail = session.customer_details?.email
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent.id

        if (customerEmail) {
          after(async () => {
            try {
              const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
              const voucherUrl =
                paymentIntent.next_action?.boleto_display_details?.hosted_voucher_url
              if (!voucherUrl) {
                // Esperamos sempre um voucher de boleto aqui; ausência indica
                // mudança no método/config do checkout — logar para investigar.
                console.warn('[boleto] PaymentIntent sem voucher URL', {
                  paymentIntentId,
                  nextAction: paymentIntent.next_action?.type,
                })
                return
              }
              await sendEmail({
                to: customerEmail,
                subject: 'Seu boleto para pagamento',
                html: `<p>Olá! Aqui está o seu boleto para concluir a compra no ProjectInBio.</p><p><a href="${voucherUrl}">Visualizar e pagar o boleto</a></p><p>O boleto expira em 3 dias.</p>`,
                text: `Aqui está o seu boleto para pagamento: ${voucherUrl} (expira em 3 dias)`,
              })
            } catch (error) {
              console.error('Erro ao enviar e-mail do boleto:', error)
            }
          })
        }
      }
      break
    }

    case 'checkout.session.async_payment_succeeded': {
      // boleto pago
      const session = event.data.object as Stripe.Checkout.Session
      const { profileId, userId } = readMetadata(session.metadata)
      if (!profileId) break

      await db.collection('profiles').doc(profileId).update({
        subscriptionStatus: 'active',
      })

      if (userId) {
        const subscriptionId = (session.subscription as string | null) ?? ''
        const amountBrl = (session.amount_total ?? 0) / 100
        let priceId = ''
        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            priceId = subscription.items.data[0]?.price.id ?? ''
          } catch (error) {
            console.error('Erro ao buscar subscription para tracking:', error)
          }
        }

        after(async () => {
          await identifyServer({ userId, isTrial: false })
          await trackServer(
            EVENTS.PAYMENT_SUCCEEDED,
            { userId, profileId, method: 'boleto', amountBrl },
            { userId }
          )
          if (subscriptionId) {
            await trackServer(
              EVENTS.SUBSCRIPTION_STARTED,
              { userId, profileId, priceId, amountBrl, subscriptionId },
              { userId }
            )
          }
        })
      }
      break
    }

    case 'checkout.session.async_payment_failed': {
      // boleto expirado ou pagamento falhou
      const session = event.data.object as Stripe.Checkout.Session
      const { profileId, userId } = readMetadata(session.metadata)
      if (!profileId) break

      await db.collection('profiles').doc(profileId).update({
        subscriptionStatus: 'canceled',
      })

      if (userId) {
        after(() =>
          trackServer(
            EVENTS.PAYMENT_FAILED,
            { userId, profileId, method: 'boleto', reason: 'async_payment_failed' },
            { userId }
          )
        )
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const { profileId, userId } = readMetadata(subscription.metadata)
      if (!profileId) break

      await db
        .collection('profiles')
        .doc(profileId)
        .update({
          stripePriceId: subscription.items.data[0]?.price.id ?? null,
          subscriptionStatus: subscription.status,
        })

      if (userId && subscription.status === 'canceled') {
        after(() =>
          trackServer(
            EVENTS.SUBSCRIPTION_CANCELED,
            { userId, profileId, subscriptionId: subscription.id },
            { userId }
          )
        )
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const { profileId, userId } = readMetadata(subscription.metadata)
      if (!profileId) break

      await db.collection('profiles').doc(profileId).update({
        subscriptionStatus: 'canceled',
      })

      if (userId) {
        after(() =>
          trackServer(
            EVENTS.SUBSCRIPTION_CANCELED,
            { userId, profileId, subscriptionId: subscription.id },
            { userId }
          )
        )
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
