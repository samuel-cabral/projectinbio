import 'server-only'

export const socialMedias = ['instagram', 'linkedin', 'x', 'facebook', 'youtube'] as const

export type HeroTexts = {
  title: string
  description: string
}

export async function getTextsBySlug(slug: string): Promise<HeroTexts | null> {
  for (const socialMedia of socialMedias) {
    const mediaSlug = `link-na-bio-para-${socialMedia}`
    if (slug === mediaSlug) {
      const capitalizedSocialMedia = socialMedia.charAt(0).toUpperCase() + socialMedia.slice(1)
      return {
        title: `Link na bio para ${capitalizedSocialMedia}`,
        description: `Compartilhe todos os seus links no perfil do seu ${capitalizedSocialMedia}`,
      }
    }
  }

  return null
}
