'use client'

import { Github, Instagram, Linkedin, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { ProfileData } from '@/app/server/get-profile-data'
import { AddCustomLink } from '@/components/common/user-card/add-custom-link'
import { EditSocialLinks } from '@/components/common/user-card/edit-social-links'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { EditProfile } from './edit-profile'

const SOCIAL_LINKS_CONFIG: {
  key: keyof NonNullable<ProfileData['socialLinks']>
  Icon: typeof Github
  label: string
}[] = [
  { key: 'github', Icon: Github, label: 'Github' },
  { key: 'linkedin', Icon: Linkedin, label: 'LinkedIn' },
  { key: 'instagram', Icon: Instagram, label: 'Instagram' },
  { key: 'twitter', Icon: Twitter, label: 'Twitter' },
]

type UserCardProps = {
  profileData: ProfileData
  avatarUrl: string | null
  isOwner: boolean
}

export function UserCard({ profileData, avatarUrl, isOwner }: UserCardProps) {
  const [localDisplayName, setLocalDisplayName] = useState<string | null>(null)
  const [localDescription, setLocalDescription] = useState<string | null>(null)
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null)

  const displayName = localDisplayName ?? (profileData.displayName?.trim() || 'Sem nome')
  const description = localDescription ?? profileData.description?.trim() ?? ''
  const avatarSrc = localAvatarUrl ?? avatarUrl ?? '/me.png'

  function handleProfileUpdated(data: {
    displayName: string
    description: string
    avatarUrl?: string | null
  }) {
    setLocalDisplayName(data.displayName)
    setLocalDescription(data.description)
    setLocalAvatarUrl(data.avatarUrl ?? null)
  }

  function handleClearOptimistic() {
    setLocalDisplayName(null)
    setLocalDescription(null)
    setLocalAvatarUrl(null)
  }

  return (
    <div className="border-opacity-10 flex w-[348px] flex-col items-center justify-center gap-5 rounded-3xl border bg-[#121212] p-5 text-white">
      <div className="size-48">
        <Image
          src={avatarSrc}
          alt={displayName}
          className="h-full w-full rounded-full object-cover"
          width={192}
          height={192}
          unoptimized={!!(localAvatarUrl ?? avatarUrl)}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="min-w-0 overflow-hidden text-3xl font-bold">{displayName}</h3>
          <EditProfile
            profileData={profileData}
            avatarUrl={avatarUrl}
            isOwner={isOwner}
            onProfileUpdated={handleProfileUpdated}
            onClearOptimistic={handleClearOptimistic}
          />
        </div>

        {description ? <p className="opacity-40">&quot;{description}&quot;</p> : null}
      </div>

      <div className="flex w-full flex-col gap-2">
        <span className="text-xs font-medium uppercase">Links</span>
        <div className="flex gap-3">
          {SOCIAL_LINKS_CONFIG.map(({ key, Icon, label }) => {
            const url = profileData.socialLinks?.[key]?.trim()
            if (!url) return null
            return (
              <Link
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'icon-xl' }),
                  'border-secondary rounded-xl'
                )}
              >
                <Icon />
              </Link>
            )
          })}
          <EditSocialLinks socialLinks={profileData.socialLinks} isOwner={isOwner} />
        </div>
      </div>
      <div className="flex min-h-[172px] w-full flex-col gap-3">
        <div className="flex w-full flex-col items-center gap-3">
          {(profileData.customLinks ?? []).map((link, index) => (
            <Link
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'default', size: 'default' }), 'w-full')}
            >
              {link.title}
            </Link>
          ))}
          <AddCustomLink customLinks={profileData.customLinks} isOwner={isOwner} />
        </div>
      </div>
    </div>
  )
}
