'use client'

import { useCallback, useState } from 'react'

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateStripePortal = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      if (!response.ok) {
        console.error('Erro no portal:', response.status, await response.text())
        return
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Erro ao abrir portal:', error)
    }
  }, [])

  const checkout = useCallback(async (priceId: string, profileId: string) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, profileId }),
      })

      if (!response.ok) {
        console.error('Erro no checkout:', response.status, await response.text())
        setIsLoading(false)
        return
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error)
      setIsLoading(false)
    }
  }, [])

  return { checkout, handleCreateStripePortal, isLoading }
}
