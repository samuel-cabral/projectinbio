'use server'

import { Timestamp } from 'firebase-admin/firestore'
import { after } from 'next/server'

import { EVENTS, trackServer } from '@/lib/analytics'
import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

export async function createLink(link: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return
  }

  try {
    await db.collection('profiles').doc(link).set({
      userId: session.user.id,
      totalVisits: 0,
      createdAt: Timestamp.now().toMillis(),
    })

    const userId = session.user.id
    after(() => trackServer(EVENTS.PROFILE_CREATED, { userId, profileId: link }, { userId }))

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
