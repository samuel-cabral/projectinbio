'use server'

import { auth } from '@/lib/auth'
import { db, storage } from '@/lib/firebase'

import { getProfileData } from '../server/get-profile-data'

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session) return false

  const profileId = (formData.get('profileId') as string)?.trim()
  if (!profileId) return false

  const profile = await getProfileData(profileId)
  if (!profile || profile.userId !== session.user?.id) return false

  const displayName = String(formData.get('displayName') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const file = formData.get('profileImage') as File | null

  let avatarImagePath: string | undefined
  const hasValidImage = file instanceof File && file.size > 0
  if (hasValidImage) {
    const storageRef = storage.file(`profile-images/${profileId}/avatar`)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await storageRef.save(buffer)
    avatarImagePath = storageRef.name
  }

  try {
    await db.collection('profiles').doc(profileId).update({
      displayName,
      description,
      ...(hasValidImage && avatarImagePath && { avatarImagePath }),
      updatedAt: Date.now(),
    })
    return true
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return false
  }
}
