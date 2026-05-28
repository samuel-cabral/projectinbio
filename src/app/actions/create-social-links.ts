'use server'

import { after } from 'next/server'

import { EVENTS, trackServer } from '@/lib/analytics'
import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

import { getProfileData } from '../server/get-profile-data'

export type CreateSocialLinksInput = {
  profileId: string
  github?: string
  instagram?: string
  linkedin?: string
  twitter?: string
}

function trimUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed === '' ? undefined : trimmed
}

export async function createSocialLinks(input: CreateSocialLinksInput) {
  const session = await auth()
  if (!session?.user?.id) return false

  const profileId = input.profileId?.trim()
  if (!profileId) return false

  const profile = await getProfileData(profileId)
  if (!profile || profile.userId !== session.user.id) return false

  const github = trimUrl(input.github)
  const instagram = trimUrl(input.instagram)
  const linkedin = trimUrl(input.linkedin)
  const twitter = trimUrl(input.twitter)

  const hasAny = [github, instagram, linkedin, twitter].some(Boolean)
  if (!hasAny) return false

  const socialLinks = {
    ...(profile.socialLinks ?? {}),
    ...(github !== undefined && { github }),
    ...(instagram !== undefined && { instagram }),
    ...(linkedin !== undefined && { linkedin }),
    ...(twitter !== undefined && { twitter }),
  }

  try {
    await db.collection('profiles').doc(profileId).update({ socialLinks })

    const networks = (['github', 'instagram', 'linkedin', 'twitter'] as const).filter(
      key => !!socialLinks[key]
    )
    const userId = session.user.id
    after(() =>
      trackServer(
        EVENTS.SOCIAL_LINKS_UPDATED,
        { userId, profileId, networks: [...networks] },
        { userId }
      )
    )

    return true
  } catch (error) {
    console.error('Erro ao salvar redes sociais:', error)
    return false
  }
}
