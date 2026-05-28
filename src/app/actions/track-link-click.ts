'use server'

import { after } from 'next/server'

import { EVENTS, trackServer } from '@/lib/analytics'
import { auth } from '@/lib/auth'

export type TrackLinkClickInput = {
  profileId: string
  kind: 'social' | 'custom'
  network?: string
  url: string
}

export async function trackLinkClick(input: TrackLinkClickInput) {
  if (!input.profileId || !input.url) return

  const session = await auth()
  const viewerUserId = session?.user?.id

  after(() =>
    trackServer(
      EVENTS.LINK_CLICKED,
      {
        profileId: input.profileId,
        kind: input.kind,
        network: input.network,
        url: input.url,
        viewerUserId,
      },
      { userId: viewerUserId }
    )
  )
}
