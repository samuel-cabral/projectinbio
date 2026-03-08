import 'server-only'

import { db } from '@/lib/firebase'

export type ProfileData = {
  userId: string
  totalVisits: number
  createdAt: number
  socialLinks?: {
    github?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
  updatedAt?: number
}

export async function getProfileData(profileId: string) {
  const snapshot = await db.collection('profiles').doc(profileId).get()
  const data = snapshot.data()
  if (!data) return undefined

  return {
    ...data,
    socialLinks: data.socialLinks ?? {},
  } as ProfileData
}
