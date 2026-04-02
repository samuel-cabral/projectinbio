'use client'

import { useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useCheckout } from '@/hooks/use-checkout'
import { ANNUAL_PRICE_WITH_DISCOUNT, formatPriceToBRL, MONTHLY_PRICE } from '@/lib/config'

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID!

export function CheckoutButtons() {
  const { profileId } = useParams<{ profileId: string }>()
  const { checkout, isLoading } = useCheckout()

  return (
    <div className="flex gap-4">
      <Button disabled={isLoading} onClick={() => checkout(MONTHLY_PRICE_ID, profileId)}>
        {`${formatPriceToBRL(MONTHLY_PRICE)} / mês`}
      </Button>
      <Button disabled={isLoading} onClick={() => checkout(ANNUAL_PRICE_ID, profileId)}>
        {`${formatPriceToBRL(ANNUAL_PRICE_WITH_DISCOUNT)} Vitalício`}
      </Button>
    </div>
  )
}
