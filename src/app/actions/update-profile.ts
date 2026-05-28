'use server'

import { after } from 'next/server'

import { EVENTS, trackServer } from '@/lib/analytics'
import type { ProfileUpdateField } from '@/lib/analytics/events'
import { auth } from '@/lib/auth'
import { db, getDownloadUrlFromPath, storage } from '@/lib/firebase'

import { getProfileData } from '../server/get-profile-data'

const AVATAR_PATH_PREFIX = 'profile-images/'

export type UpdateProfileResult =
  | {
      ok: true
      data: { displayName: string; description: string; avatarUrl?: string }
    }
  | { ok: false }

export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
  const session = await auth()
  if (!session?.user?.id) return { ok: false }

  const profileId = (formData.get('profileId') as string)?.trim()
  if (!profileId) return { ok: false }

  const profile = await getProfileData(profileId)
  if (!profile || profile.userId !== session.user.id) return { ok: false }

  const displayName = String(formData.get('displayName') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const file = formData.get('profileImage') as File | null

  const avatarWritePath = `${AVATAR_PATH_PREFIX}${profileId}/avatar`
  let avatarImagePath: string | undefined
  const hasValidImage = file instanceof File && file.size > 0

  if (hasValidImage) {
    const existingPath = profile.avatarImagePath
    if (existingPath && existingPath !== avatarWritePath) {
      try {
        await storage.file(existingPath).delete()
      } catch (err) {
        if ((err as { code?: number })?.code !== 404) {
          console.error('Erro ao remover foto anterior do storage:', err)
        }
      }
    }
    const storageRef = storage.file(avatarWritePath)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await storageRef.save(buffer)
    avatarImagePath = storageRef.name
  }

  try {
    await db
      .collection('profiles')
      .doc(profileId)
      .update({
        displayName,
        description,
        ...(hasValidImage && avatarImagePath && { avatarImagePath }),
        updatedAt: Date.now(),
      })

    let avatarUrl: string | undefined
    if (avatarImagePath) {
      const url = await getDownloadUrlFromPath(avatarImagePath)
      if (url) avatarUrl = url
    }

    const changed: ProfileUpdateField[] = []
    if (displayName !== (profile.displayName ?? '').trim()) changed.push('displayName')
    if (description !== (profile.description ?? '').trim()) changed.push('description')
    if (hasValidImage) changed.push('avatar')

    if (changed.length > 0) {
      const userId = session.user.id
      after(() => trackServer(EVENTS.PROFILE_UPDATED, { userId, profileId, changed }, { userId }))
    }

    return {
      ok: true,
      data: { displayName, description, ...(avatarUrl && { avatarUrl }) },
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return { ok: false }
  }
}
