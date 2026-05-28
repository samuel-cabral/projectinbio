'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { trackPageview } from '@/lib/analytics/client'

export function AnalyticsPageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    const query = searchParams?.toString()
    const path = query ? `${pathname}?${query}` : pathname
    trackPageview(path)
  }, [pathname, searchParams])

  return null
}
