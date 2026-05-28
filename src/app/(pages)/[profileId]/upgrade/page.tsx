import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { CheckoutButtons } from './checkout-buttons'

export default async function UpgradePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/')
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Escolha o plano</h2>
      <CheckoutButtons userId={session.user.id} />
    </div>
  )
}
