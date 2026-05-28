import type { Metadata } from 'next'

import { FAQ } from '../../components/landing-page/faq'
import { Header } from '../../components/landing-page/header'
import { Hero } from '../../components/landing-page/hero'
import { Pricing } from '../../components/landing-page/pricing'
import { VideoExplanation } from '../../components/landing-page/video-explanation'
import { getSEOTags } from '../../lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = getSEOTags({
  appName: 'ProjectInBio',
  appDescription: 'ProjectInBio - Seus projetos e redes sociais em um único link',
  keywords: ['ProjectInBio', 'projetos', 'redes sociais', 'link'],
  appDomain: 'https://projectinbio.luzomind.com',
  canonicalUrlRelative: '/',
})

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl">
      <Header />
      <Hero />
      <VideoExplanation />
      <Pricing />
      <FAQ />
      {/* <Footer /> */}
    </div>
  )
}
