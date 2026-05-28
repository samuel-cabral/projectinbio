import type { MetadataRoute } from 'next'

import { socialMedias } from './server/get-texts-by-slug'

const BASE_URL = 'https://projectinbio.luzomind.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  const socialMediaEntries: MetadataRoute.Sitemap = socialMedias.map(media => ({
    url: `${BASE_URL}/recursos/link-na-bio-para-${media}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticEntries, ...socialMediaEntries]
}
