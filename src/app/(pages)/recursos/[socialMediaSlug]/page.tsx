import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getTextsBySlug } from '@/app/server/get-texts-by-slug'
import { FAQ } from '@/components/landing-page/faq'
import { Header } from '@/components/landing-page/header'
import { Hero } from '@/components/landing-page/hero'
import { Pricing } from '@/components/landing-page/pricing'
import { VideoExplanation } from '@/components/landing-page/video-explanation'
import { getSEOTags } from '@/lib/seo'

type RecursoPageProps = {
  params: Promise<{ socialMediaSlug: string }>
}

export async function generateMetadata({ params }: RecursoPageProps): Promise<Metadata> {
  const { socialMediaSlug } = await params
  const texts = await getTextsBySlug(socialMediaSlug)

  if (!texts) {
    return {}
  }

  return getSEOTags({
    appName: texts.title,
    appDescription: texts.description,
    keywords: ['ProjectInBio', 'link na bio', 'projetos', 'redes sociais', 'link'],
    appDomain: 'https://projectinbio.luzomind.com',
    canonicalUrlRelative: `/recursos/${socialMediaSlug}`,
  })
}

export default async function RecursoPage({ params }: RecursoPageProps) {
  const { socialMediaSlug } = await params

  const texts = await getTextsBySlug(socialMediaSlug)

  if (!texts) {
    return notFound()
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Header />
      <Hero texts={texts} />
      <VideoExplanation />
      <Pricing />
      <FAQ />
    </div>
  )
}
