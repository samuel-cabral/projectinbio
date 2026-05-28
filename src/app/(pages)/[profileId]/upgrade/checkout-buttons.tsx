'use client'

import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useCheckout } from '@/hooks/use-checkout'
import { EVENTS, trackClient } from '@/lib/analytics/client'
import { ANNUAL_PRICE_WITH_DISCOUNT, formatPriceToBRL, MONTHLY_PRICE } from '@/lib/config'

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!

type CheckoutButtonsProps = {
  userId: string
}

export function CheckoutButtons({ userId }: CheckoutButtonsProps) {
  const { profileId } = useParams<{ profileId: string }>()
  const { checkout, isLoading } = useCheckout()

  function handleCheckout(priceId: string, plan: 'monthly' | 'annual') {
    trackClient(EVENTS.CHECKOUT_STARTED, { userId, profileId, priceId, plan })
    checkout(priceId, profileId)
  }

  return (
    <div className="flex gap-4">
      <Button disabled={isLoading} onClick={() => handleCheckout(MONTHLY_PRICE_ID, 'monthly')}>
        {`${formatPriceToBRL(MONTHLY_PRICE)} / mês`}
      </Button>
      <Button disabled={isLoading} onClick={() => handleCheckout(ANNUAL_PRICE_ID, 'annual')}>
        {`${formatPriceToBRL(ANNUAL_PRICE_WITH_DISCOUNT)} Vitalício`}
      </Button>
    </div>
  )
}
