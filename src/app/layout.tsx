import './globals.css'

import { Red_Hat_Display } from 'next/font/google'

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHatDisplay.className} dark bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
