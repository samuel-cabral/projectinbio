'use server'

import { FieldValue } from 'firebase-admin/firestore'

import { db } from '@/lib/firebase'

export async function increaseProfileVisits(profileId: string) {
  const id = profileId?.trim()
  if (!id) return
  const profileRef = db.collection('profiles').doc(id)

  try {
    await profileRef.update({
      totalVisits: FieldValue.increment(1),
    })
  } catch (error) {
    console.error('Erro ao incrementar visitas:', error)
  }
}
