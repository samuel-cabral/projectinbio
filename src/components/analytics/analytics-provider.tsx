'use client'

import { useEffect } from 'react'

import { identifyClient, initClientAnalytics } from '@/lib/analytics/client'
import type { UserIdentity } from '@/lib/analytics/types'

type AnalyticsProviderProps = {
  identity: UserIdentity | null
}

export function AnalyticsProvider({ identity }: AnalyticsProviderProps) {
  useEffect(() => {
    initClientAnalytics()
    if (identity) identifyClient(identity)
  }, [identity])

  return null
}
