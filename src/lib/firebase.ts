import 'server-only'

import {
  cert,
  type Credential,
  getApps,
  initializeApp,
} from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

function getPrivateKey(): string {
  const base64Key = process.env.FIREBASE_PRIVATE_KEY_BASE64
  if (!base64Key) {
    throw new Error('FIREBASE_PRIVATE_KEY_BASE64 is not set')
  }
  return Buffer.from(base64Key, 'base64').toString('utf-8').trim()
}

function createFirebaseCert(): Credential {
  return cert({
    projectId: process.env.FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: getPrivateKey(),
  })
}

let _firebaseCert: Credential | null = null

export function getFirebaseCert(): Credential {
  if (!_firebaseCert) {
    _firebaseCert = createFirebaseCert()
  }
  return _firebaseCert
}

function initFirebase() {
  if (!getApps().length) {
    initializeApp({
      credential: getFirebaseCert(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
    })
  }
}

initFirebase()

export const db = getFirestore()

export const storage = getStorage().bucket()
