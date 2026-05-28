import './globals.css'

import { GoogleAnalytics } from '@next/third-parties/google'
import { Red_Hat_Display } from 'next/font/google'
import { Suspense } from 'react'

import { AnalyticsPageview } from '@/components/analytics/analytics-pageview'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import type { UserIdentity } from '@/lib/analytics/types'
import { auth } from '@/lib/auth'

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const identity: UserIdentity | null = session?.user?.id
    ? {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        isTrial: session.user.isTrial,
      }
    : null

  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en">
      <body className={`${redHatDisplay.className} dark bg-background text-foreground antialiased`}>
        <AnalyticsProvider identity={identity} />
        <Suspense fallback={null}>
          <AnalyticsPageview />
        </Suspense>
        {children}
      </body>
      {gaMeasurementId && <GoogleAnalytics gaId={gaMeasurementId} />}
    </html>
  )
}
