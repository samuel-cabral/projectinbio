'use client'

import { useCheckout } from '@/hooks/use-checkout'

export function PortalButton() {
  const { handleCreateStripePortal } = useCheckout()

  return (
    <button
      className="cursor-pointer font-bold text-white hover:underline"
      onClick={handleCreateStripePortal}
    >
      Portal
    </button>
  )
}
