import type { Metadata } from 'next'
import { Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Mono, Inter, Playfair_Display, Roboto, Lora } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['300', '400', '600', '700'],
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ResuHive',
  description:
    'Build ATS-friendly resumes and check them against real job descriptions.',
}

import { GlobalFooter } from '@/components/layout/GlobalFooter'
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSerif4.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${inter.variable} ${playfairDisplay.variable} ${roboto.variable} ${lora.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <GlobalFooter />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
