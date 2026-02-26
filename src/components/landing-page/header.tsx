import Image from 'next/image'

import { auth } from '@/lib/auth'

import { manageAuth } from '../../app/actions/manage-auth'
import { Button } from '../ui/button'

export async function Header() {
  const session = await auth()

  return (
    <div className="absolute top-0 right-0 left-0 mx-auto flex max-w-7xl items-center justify-between py-10">
      <div className="flex items-center gap-4">
        <Image src="/icon.svg" alt="ProjectInBio Logo" width={32} height={32} />
        <h3 className="text-2xl font-bold text-white">ProjectInBio</h3>
      </div>

      <div className="flex items-center gap-4">
        {session && <Button>Minha Página</Button>}
        <form action={manageAuth}>
          <Button>{!session ? 'Login' : 'Sair'}</Button>
        </form>
      </div>
    </div>
  )
}
