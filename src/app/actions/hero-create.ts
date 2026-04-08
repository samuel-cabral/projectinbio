'use server'

import { redirect } from 'next/navigation'

import { getProfileIdByUserId } from '@/app/server/get-profile-data'
import { auth, signIn } from '@/lib/auth'

export async function heroCreate(formData: FormData) {
  const link = formData.get('link')?.toString() || ''
  const session = await auth()

  if (!session) {
    const redirectTo = link ? `/criar?link=${link}` : '/criar'
    return await signIn('google', { redirectTo })
  }

  const profileId = await getProfileIdByUserId(session.user.id)
  if (profileId) {
    redirect(`/${profileId}`)
  }

  redirect(link ? `/criar?link=${link}` : '/criar')
}
