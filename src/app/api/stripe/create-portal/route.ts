import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const profileSnapshot = await db
      .collection('profiles')
      .where('userId', '==', userId)
      .limit(1)
      .get()

    const profileData = profileSnapshot.docs[0]?.data()
    const stripeCustomerId = profileData?.stripeCustomerId as string | undefined

    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'Cliente Stripe não encontrado' }, { status: 400 })
    }

    const origin = request.headers.get('origin') ?? ''

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: origin,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Erro ao criar portal session:', message, error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
