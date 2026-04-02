'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/firebase'

import { getProfileData } from '../server/get-profile-data'

const MAX_CUSTOM_LINKS = 3

export type CreateCustomLinkItem = { title: string; url: string }

export type CreateCustomLinkInput = {
  profileId: string
  links: CreateCustomLinkItem[]
}

export async function createCustomLink(input: CreateCustomLinkInput) {
  const session = await auth()
  if (!session) return false

  const profileId = input.profileId?.trim()
  if (!profileId) return false

  if (input.links.length > MAX_CUSTOM_LINKS) return false

  const profile = await getProfileData(profileId)
  if (!profile || profile.userId !== session.user?.id) return false

  const validLinks = input.links
    .map(({ title, url }) => ({
      title: title?.trim() ?? '',
      url: url?.trim() ?? '',
    }))
    .filter(({ title, url }) => title !== '' && url !== '')
    .slice(0, MAX_CUSTOM_LINKS)

  try {
    await db.collection('profiles').doc(profileId).update({ customLinks: validLinks })
    return true
  } catch (error) {
    console.error('Erro ao salvar custom links:', error)
    return false
  }
}
