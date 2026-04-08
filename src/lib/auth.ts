import { FirestoreAdapter } from '@auth/firebase-adapter'
import NextAuth from 'next-auth'

import { authConfig } from './auth.config'
import { TRIAL_DAYS } from './config'
import { db, getFirebaseCert } from './firebase'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: FirestoreAdapter({
    credential: getFirebaseCert(),
  }),
  events: {
    async createUser({ user }) {
      if (!user.id) return
      await db.collection('users').doc(user.id).update({
        createdAt: Date.now(),
      })
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const userDoc = await db.collection('users').doc(user.id!).get()
        token.createdAt = userDoc.data()?.createdAt ?? null
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string

      const createdAt = token.createdAt as number | null
      session.user.isTrial = createdAt
        ? Date.now() < createdAt + 1000 * 60 * 60 * 24 * TRIAL_DAYS
        : false

      return session
    },
  },
})
