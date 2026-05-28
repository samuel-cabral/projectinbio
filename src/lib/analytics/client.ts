'use client'

import { sendGAEvent } from '@next/third-parties/google'
import mixpanel from 'mixpanel-browser'

import { type EventMap, type EventName, EVENTS } from './events'
import type { UserIdentity } from './types'

let initialized = false

export function initClientAnalytics(): void {
  if (initialized) return
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
  if (!token) return

  mixpanel.init(token, {
    track_pageview: false,
    persistence: 'localStorage',
    debug: process.env.NODE_ENV !== 'production',
  })
  initialized = true
}

export function identifyClient(identity: UserIdentity): void {
  if (!initialized) return

  mixpanel.identify(identity.userId)

  const profile: Record<string, unknown> = {}
  if (identity.email) profile.$email = identity.email
  if (identity.name) profile.$name = identity.name
  if (typeof identity.isTrial === 'boolean') profile.isTrial = identity.isTrial

  if (Object.keys(profile).length > 0) {
    mixpanel.people.set(profile)
  }
}

export function trackClient<K extends EventName>(name: K, properties: EventMap[K]): void {
  if (initialized) {
    mixpanel.track(name, properties)
  }
  sendGAEvent('event', name, properties as Record<string, unknown>)
}

export function trackPageview(path: string): void {
  if (initialized) {
    mixpanel.track('page_view', { path })
  }
}

export { EVENTS }
export type { EventMap, EventName, UserIdentity }
