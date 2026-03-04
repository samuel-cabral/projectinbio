import 'server-only'

import { db } from '@/lib/firebase'

interface ProfileData {
  userId: string
  totalVisits: number
  createdAt: number
  // add more fields here later
}

export async function getProfileData(profileId: string) {
  const snapshot = await db.collection('profiles').doc(profileId).get()

  return snapshot.data() as ProfileData | undefined
}
