export const EVENTS = {
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  PROFILE_CREATED: 'profile_created',
  PROFILE_UPDATED: 'profile_updated',
  PROFILE_VIEWED: 'profile_viewed',
  PROJECT_CREATED: 'project_created',
  PROJECT_CLICKED: 'project_clicked',
  SOCIAL_LINKS_UPDATED: 'social_links_updated',
  CUSTOM_LINK_CREATED: 'custom_link_created',
  LINK_CLICKED: 'link_clicked',
  CHECKOUT_STARTED: 'checkout_started',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  PAYMENT_SUCCEEDED: 'payment_succeeded',
  PAYMENT_FAILED: 'payment_failed',
} as const

export type EventName = (typeof EVENTS)[keyof typeof EVENTS]

export type ProfileUpdateField = 'displayName' | 'description' | 'avatar'
export type LinkKind = 'social' | 'custom'
export type CheckoutPlan = 'monthly' | 'annual'
export type PaymentMethod = 'card' | 'boleto'
export type AuthProvider = 'google'

export type EventMap = {
  [EVENTS.USER_SIGNED_UP]: { userId: string; provider: AuthProvider }
  [EVENTS.USER_SIGNED_IN]: { userId: string; provider: AuthProvider }
  [EVENTS.PROFILE_CREATED]: { userId: string; profileId: string }
  [EVENTS.PROFILE_UPDATED]: {
    userId: string
    profileId: string
    changed: ProfileUpdateField[]
  }
  [EVENTS.PROFILE_VIEWED]: {
    profileId: string
    ownerUserId: string
    viewerUserId?: string
  }
  [EVENTS.PROJECT_CREATED]: {
    userId: string
    profileId: string
    projectId: string
    hasImage: boolean
  }
  [EVENTS.PROJECT_CLICKED]: {
    profileId: string
    projectId: string
    viewerUserId?: string
  }
  [EVENTS.SOCIAL_LINKS_UPDATED]: {
    userId: string
    profileId: string
    networks: string[]
  }
  [EVENTS.CUSTOM_LINK_CREATED]: {
    userId: string
    profileId: string
    count: number
  }
  [EVENTS.LINK_CLICKED]: {
    profileId: string
    kind: LinkKind
    network?: string
    url: string
    viewerUserId?: string
  }
  [EVENTS.CHECKOUT_STARTED]: {
    userId: string
    profileId: string
    priceId: string
    plan: CheckoutPlan
  }
  [EVENTS.SUBSCRIPTION_STARTED]: {
    userId: string
    profileId: string
    priceId: string
    amountBrl: number
    subscriptionId: string
  }
  [EVENTS.SUBSCRIPTION_CANCELED]: {
    userId: string
    profileId: string
    subscriptionId: string
  }
  [EVENTS.PAYMENT_SUCCEEDED]: {
    userId: string
    profileId: string
    method: PaymentMethod
    amountBrl: number
  }
  [EVENTS.PAYMENT_FAILED]: {
    userId: string
    profileId: string
    method: PaymentMethod
    reason?: string
  }
}

export type EventProperties<K extends EventName> = EventMap[K]
