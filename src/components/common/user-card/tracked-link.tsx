'use client'

import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { trackLinkClick } from '@/app/actions/track-link-click'

type TrackedLinkProps = Omit<ComponentProps<typeof Link>, 'onClick' | 'href'> & {
  profileId: string
  kind: 'social' | 'custom'
  network?: string
  url: string
  children: ReactNode
}

export function TrackedLink({
  profileId,
  kind,
  network,
  url,
  children,
  ...rest
}: TrackedLinkProps) {
  function handleClick() {
    // Fire-and-forget: target="_blank" mantém a aba originária ativa,
    // então a request server-side completa mesmo após o clique.
    void trackLinkClick({ profileId, kind, network, url })
  }

  return (
    <Link {...rest} href={url} onClick={handleClick}>
      {children}
    </Link>
  )
}
