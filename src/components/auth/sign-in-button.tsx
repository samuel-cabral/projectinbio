import { signIn } from '@/lib/auth'

export function SignInButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn('google')
      }}
    >
      <button
        type="submit"
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
      >
        Entrar com Google
      </button>
    </form>
  )
}
