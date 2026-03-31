'use server'

import { FieldValue } from 'firebase-admin/firestore'

import { db } from '@/lib/firebase'

export async function increaseProjectVisits(profileId: string, projectId: string) {
  if (!profileId || !projectId) return

  const projectRef = db.collection('profiles').doc(profileId).collection('projects').doc(projectId)

  try {
    await projectRef.update({
      totalVisits: FieldValue.increment(1),
    })
  } catch (error) {
    console.error('Erro ao incrementar visitas do projeto:', error)
  }
}
