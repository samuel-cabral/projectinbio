import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { priceId, profileId } = await request.json()

  if (!priceId || !profileId) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const profileRef = db.collection('profiles').doc(profileId)
  const profileSnap = await profileRef.get()
  const profileData = profileSnap.data()

  if (!profileData || profileData.userId !== session.user.id) {
    return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
  }

  try {
    let stripeCustomerId = profileData.stripeCustomerId as string | undefined

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        metadata: { profileId, userId: session.user.id },
      })
      stripeCustomerId = customer.id
      await profileRef.update({ stripeCustomerId })
    }

    const origin = request.headers.get('origin') ?? ''

    const price = await stripe.prices.retrieve(priceId)
    const isSubscription = price.type === 'recurring'

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/${profileId}?checkout=success`,
      cancel_url: `${origin}/${profileId}/upgrade`,
      metadata: { profileId, userId: session.user.id },
      ...(isSubscription && {
        subscription_data: {
          metadata: { profileId, userId: session.user.id },
        },
      }),
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Erro ao criar checkout session:', message, error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
