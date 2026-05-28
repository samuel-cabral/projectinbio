'use server'

import { FieldValue } from 'firebase-admin/firestore'
import { after } from 'next/server'

import { EVENTS, trackServer } from '@/lib/analytics'
import { db } from '@/lib/firebase'

export type IncreaseProjectVisitsOptions = {
  viewerUserId?: string
}

export async function increaseProjectVisits(
  profileId: string,
  projectId: string,
  opts: IncreaseProjectVisitsOptions = {}
) {
  if (!profileId || !projectId) return

  const projectRef = db.collection('profiles').doc(profileId).collection('projects').doc(projectId)

  try {
    await projectRef.update({
      totalVisits: FieldValue.increment(1),
    })
  } catch (error) {
    console.error('Erro ao incrementar visitas do projeto:', error)
    return
  }

  after(() =>
    trackServer(
      EVENTS.PROJECT_CLICKED,
      { profileId, projectId, viewerUserId: opts.viewerUserId },
      { userId: opts.viewerUserId }
    )
  )
}
