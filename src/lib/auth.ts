import { FirestoreAdapter } from '@auth/firebase-adapter'
import NextAuth from 'next-auth'

import { EVENTS, identifyServer, trackServer } from '@/lib/analytics'

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
      const createdAt = Date.now()
      await db.collection('users').doc(user.id).update({ createdAt })

      // NextAuth events rodam fora de scope de request confiável — usar await direto,
      // não after(). Falhas em analytics nunca devem quebrar o fluxo de signup.
      try {
        await identifyServer({
          userId: user.id,
          email: user.email,
          name: user.name,
          createdAt,
          isTrial: true,
        })
        await trackServer(
          EVENTS.USER_SIGNED_UP,
          { userId: user.id, provider: 'google' },
          { userId: user.id }
        )
      } catch (error) {
        console.error('[auth] track signup falhou:', error)
      }
    },
    async signIn({ user, isNewUser }) {
      // createUser já cobre o caso de signup; aqui só nos importam logins de retorno.
      if (isNewUser || !user.id) return
      const userId = user.id
      try {
        await trackServer(EVENTS.USER_SIGNED_IN, { userId, provider: 'google' }, { userId })
      } catch (error) {
        console.error('[auth] track signin falhou:', error)
      }
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
