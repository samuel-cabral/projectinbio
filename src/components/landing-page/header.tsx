import Image from 'next/image'
import Link from 'next/link'

import { auth } from '@/lib/auth'

import { SignInButton } from '../auth/sign-in-button'
import { SignOutButton } from '../auth/sign-out-button'

export async function Header() {
  const session = await auth()

  return (
    <div className="absolute top-0 right-0 left-0 mx-auto flex max-w-7xl items-center justify-between py-10">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/icon.svg" alt="ProjectInBio Logo" width={32} height={32} />
        <h3 className="text-2xl font-bold text-white">ProjectInBio</h3>
      </Link>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <Link
              href="/criar"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Minha Página
            </Link>
            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  )
}
