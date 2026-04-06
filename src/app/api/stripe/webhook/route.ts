import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

import { db } from '@/lib/firebase'
import { stripe } from '@/lib/stripe'

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
      const profileId = session.metadata?.profileId
      if (!profileId) break

      const subscriptionId = session.subscription as string | null

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        await db
          .collection('profiles')
          .doc(profileId)
          .update({
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0]?.price.id ?? null,
            subscriptionStatus: subscription.status,
          })
      } else if (session.payment_status === 'paid') {
        // Pagamento único (ex: plano vitalício)
        await db
          .collection('profiles')
          .doc(profileId)
          .update({
            stripeCustomerId: session.customer as string,
            subscriptionStatus: 'active',
          })
      }
      break
    }

    case 'checkout.session.async_payment_succeeded': {
      // boleto pago
      const session = event.data.object as Stripe.Checkout.Session
      const profileId = session.metadata?.profileId
      if (!profileId) break

      await db.collection('profiles').doc(profileId).update({
        subscriptionStatus: 'active',
      })
      break
    }

    case 'checkout.session.async_payment_failed': {
      // boleto expirado ou pagamento falhou
      const session = event.data.object as Stripe.Checkout.Session
      const profileId = session.metadata?.profileId
      if (!profileId) break

      await db.collection('profiles').doc(profileId).update({
        subscriptionStatus: 'canceled',
      })
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const profileId = subscription.metadata?.profileId
      if (!profileId) break

      await db
        .collection('profiles')
        .doc(profileId)
        .update({
          stripePriceId: subscription.items.data[0]?.price.id ?? null,
          subscriptionStatus: subscription.status,
        })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const profileId = subscription.metadata?.profileId
      if (!profileId) break

      await db.collection('profiles').doc(profileId).update({
        subscriptionStatus: 'canceled',
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
