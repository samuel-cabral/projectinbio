'use server'

import { FieldValue } from 'firebase-admin/firestore'
import { after } from 'next/server'

import { EVENTS, trackServer } from '@/lib/analytics'
import { db } from '@/lib/firebase'

export type IncreaseProfileVisitsOptions = {
  ownerUserId: string
  viewerUserId?: string
}

export async function increaseProfileVisits(profileId: string, opts: IncreaseProfileVisitsOptions) {
  const id = profileId?.trim()
  if (!id) return
  const profileRef = db.collection('profiles').doc(id)

  try {
    await profileRef.update({
      totalVisits: FieldValue.increment(1),
    })
  } catch (error) {
    console.error('Erro ao incrementar visitas:', error)
    return
  }

  after(() =>
    trackServer(
      EVENTS.PROFILE_VIEWED,
      {
        profileId: id,
        ownerUserId: opts.ownerUserId,
        viewerUserId: opts.viewerUserId,
      },
      { userId: opts.viewerUserId }
    )
  )
}
