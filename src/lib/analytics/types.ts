export type { EventMap, EventName, EventProperties } from './events'

export type UserIdentity = {
  userId: string
  email?: string | null
  name?: string | null
  createdAt?: number
  isTrial?: boolean
}

export type TrackOptions = {
  userId?: string
  anonymousId?: string
}
