'use server'

import { randomUUID } from 'node:crypto'

import { Timestamp } from 'firebase-admin/firestore'
import { after } from 'next/server'

import { EVENTS, trackServer } from '@/lib/analytics'
import { auth } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'

import { getProfileData } from '../server/get-profile-data'

export async function createProject(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return false

  const profileId = (formData.get('profileId') as string)?.trim()
  if (!profileId) {
    console.error('createProject: profileId ausente ou vazio')
    return false
  }

  const profile = await getProfileData(profileId)
  if (!profile || profile.userId !== session.user.id) return false

  const projectTitle = String(formData.get('projectTitle') ?? '').trim()
  const projectDescription = String(formData.get('projectDescription') ?? '').trim()
  const projectUrl = String(formData.get('projectUrl') ?? '').trim()
  const file = formData.get('projectImage') as File | null

  const generatedId = randomUUID()

  let imagePath: string | null = null
  const hasValidImage = file instanceof File && file.size > 0
  if (hasValidImage) {
    const storageRef = storage.file(`projects-images/${profileId}/${generatedId}`)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await storageRef.save(buffer)
    imagePath = storageRef.name
  }

  try {
    await db
      .collection('profiles')
      .doc(profileId)
      .collection('projects')
      .doc(generatedId)
      .set({
        userId: session.user.id,
        projectTitle,
        projectDescription,
        projectUrl,
        ...(imagePath && { imagePath }),
        createdAt: Timestamp.now().toMillis(),
      })

    const userId = session.user.id
    after(() =>
      trackServer(
        EVENTS.PROJECT_CREATED,
        { userId, profileId, projectId: generatedId, hasImage: hasValidImage },
        { userId }
      )
    )

    return true
  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    return false
  }
}
