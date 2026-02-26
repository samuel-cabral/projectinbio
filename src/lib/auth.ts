import { FirestoreAdapter } from '@auth/firebase-adapter'
import NextAuth from 'next-auth'

import { authConfig } from './auth.config'
import { getFirebaseCert } from './firebase'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: FirestoreAdapter({
    credential: getFirebaseCert(),
  }),
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
