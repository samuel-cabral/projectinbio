import 'server-only'

import { db } from '@/lib/firebase'

import type { CreateCustomLinkItem } from '../actions/create-custom-link'

export type ProfileData = {
  userId: string
  totalVisits: number
  createdAt: number
  displayName?: string
  description?: string
  avatarImagePath?: string
  socialLinks?: {
    github?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
  customLinks?: CreateCustomLinkItem[]
  updatedAt?: number
}

export async function getProfileData(profileId: string) {
  const snapshot = await db.collection('profiles').doc(profileId).get()
  const data = snapshot.data()
  if (!data) return undefined

  return {
    ...data,
    socialLinks: data.socialLinks ?? {},
    customLinks: data.customLinks ?? [],
  } as ProfileData
}
