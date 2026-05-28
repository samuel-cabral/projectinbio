import 'server-only'

import { randomUUID } from 'node:crypto'

import Mixpanel from 'mixpanel'

import { type EventMap, type EventName, EVENTS } from './events'
import type { TrackOptions, UserIdentity } from './types'

const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect'
const GA_DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect'

let _mp: ReturnType<typeof Mixpanel.init> | null = null
let _mpWarned = false
let _gaWarned = false

function getMp(): ReturnType<typeof Mixpanel.init> | null {
  if (_mp) return _mp
  const token = process.env.MIXPANEL_TOKEN
  if (!token) {
    if (!_mpWarned) {
      console.warn(
        '[analytics] MIXPANEL_TOKEN ausente — eventos server-side do Mixpanel desabilitados'
      )
      _mpWarned = true
    }
    return null
  }
  _mp = Mixpanel.init(token)
  return _mp
}

function resolveDistinctId(opts?: TrackOptions): string {
  return opts?.userId ?? opts?.anonymousId ?? randomUUID()
}

function isDev(): boolean {
  return process.env.NODE_ENV !== 'production'
}

async function sendGaEvent(
  name: string,
  params: Record<string, unknown>,
  clientId: string,
  userId?: string
): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const apiSecret = process.env.GA_API_SECRET
  if (!measurementId || !apiSecret) {
    if (!_gaWarned) {
      console.warn(
        '[analytics] NEXT_PUBLIC_GA_MEASUREMENT_ID ou GA_API_SECRET ausente — eventos server-side do GA4 desabilitados'
      )
      _gaWarned = true
    }
    return
  }

  const endpoint = isDev() ? GA_DEBUG_ENDPOINT : GA_ENDPOINT
  const url = `${endpoint}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`

  const body: Record<string, unknown> = {
    client_id: clientId,
    events: [{ name, params }],
  }
  if (userId) body.user_id = userId

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  })

  if (isDev() && response.ok) {
    try {
      const validation = (await response.json()) as {
        validationMessages?: Array<{ description?: string; fieldPath?: string }>
      }
      if (validation.validationMessages?.length) {
        console.warn('[analytics] GA4 validation messages:', validation.validationMessages)
      }
    } catch {
      // debug endpoint returned non-JSON; ignore
    }
  }
}

export async function trackServer<K extends EventName>(
  name: K,
  properties: EventMap[K],
  opts?: TrackOptions
): Promise<void> {
  const distinctId = resolveDistinctId(opts)

  try {
    getMp()?.track(name, { distinct_id: distinctId, ...properties })
  } catch (error) {
    console.error('[analytics] Mixpanel track falhou:', error)
  }

  try {
    await sendGaEvent(name, properties as Record<string, unknown>, distinctId, opts?.userId)
  } catch (error) {
    console.error('[analytics] GA4 Measurement Protocol falhou:', error)
  }
}

export async function identifyServer(identity: UserIdentity): Promise<void> {
  const mp = getMp()
  if (!mp) return

  const profile: Record<string, unknown> = {}
  if (identity.email) profile.$email = identity.email
  if (identity.name) profile.$name = identity.name
  if (identity.createdAt) profile.$created = new Date(identity.createdAt).toISOString()
  if (typeof identity.isTrial === 'boolean') profile.isTrial = identity.isTrial

  try {
    mp.people.set(identity.userId, profile)
  } catch (error) {
    console.error('[analytics] Mixpanel identify falhou:', error)
  }
}

export { EVENTS }
export type { EventMap, EventName, UserIdentity }
