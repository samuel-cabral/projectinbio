import { Rocket } from 'lucide-react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getProfileIdByUserId } from '@/app/server/get-profile-data'
import { Header } from '@/components/landing-page/header'
import { auth } from '@/lib/auth'

import { CreateLinkForm } from './create-link-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ProjectInBio - Criar',
  description: 'ProjectInBio - Criar',
}

export default async function CriarPage() {
  const session = await auth()

  if (session?.user?.id) {
    const profileId = await getProfileIdByUserId(session.user.id)
    if (profileId) {
      redirect(`/${profileId}`)
    }
  }
  return (
    <div>
      <Header />
      <div className="mx-auto flex h-screen max-w-xl flex-col items-center justify-center gap-10">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">Escolha seu link</h1>
          <Rocket className="size-10" />
        </div>

        <CreateLinkForm />
      </div>
    </div>
  )
}
