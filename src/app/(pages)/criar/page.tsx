import { Rocket } from 'lucide-react'

import { Header } from '@/components/landing-page/header'

import { CreateLinkForm } from './create-link-form'

export const dynamic = 'force-dynamic'

export default function CriarPage() {
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
