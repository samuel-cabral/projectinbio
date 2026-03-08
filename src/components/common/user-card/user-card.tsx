'use client'

import { Github, Instagram, Linkedin, Plus, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { ProfileData } from '@/app/server/get-profile-data'
import { EditSocialLinks } from '@/components/common/user-card/edit-social-links'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
}

export function UserCard({ profileData }: UserCardProps) {
  return (
    <div className="border-opacity-10 flex w-[348px] flex-col items-center justify-center gap-5 rounded-3xl border bg-[#121212] p-5 text-white">
      <div className="size-48">
        <Image
          src="/me.png"
          alt="Samuel Cabral"
          className="h-full w-full rounded-full object-cover"
          width={192}
          height={192}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="min-w-0 overflow-hidden text-3xl font-bold">Samuel Cabral</h3>
        </div>

        <p className="opacity-40">&quot;Eu faço produtos para a Internet&quot;</p>
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
          <EditSocialLinks socialLinks={profileData.socialLinks} />
        </div>
      </div>
      <div className="flex h-[172px] w-full flex-col gap-3">
        <div className="flex w-full flex-col items-center gap-3">
          <Button className="w-full">Template SaaS - Compre agora</Button>
          <Button variant="secondary" size="icon-xl" className="border-secondary rounded-xl">
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  )
}
