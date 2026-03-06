import imageCompression from 'browser-image-compression'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeLink(link?: string) {
  if (!link) return ''

  return link
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLocaleLowerCase()
}

export async function compressImage(file: File): Promise<File | null> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 900,
      useWebWorker: true,
      fileType: 'image/png',
    })
  } catch (error) {
    console.error('Erro ao comprimir arquivo:', error)
    return null
  }
}
