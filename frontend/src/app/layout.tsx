import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import PageTransition from '@/components/motion/page-transition'
import SmoothScroll from '@/components/motion/smooth-scroll'
import ScrollToTop from '@/components/motion/scroll-to-top'
import PageProgress from '@/components/motion/page-progress'
import LiveRegion from '@/components/motion/live-region'
import AnalyticsTracker from '@/components/motion/analytics-tracker'
import { AnalyticsScript } from '@/lib/analytics'
import dynamic from 'next/dynamic'
import { Toaster } from 'sonner'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const CommandPalette = dynamic(() => import('@/components/motion/command-palette'), { ssr: false })
const ChatSheet = dynamic(() => import('@/components/chat/chat-sheet'), { ssr: false })

export const metadata: Metadata = {
  title: {
    default: 'Mehdi Abbas Nathani — Portfolio',
    template: '%s | Mehdi Abbas Nathani',
  },
  description:
    'Portfolio of Mehdi Abbas Nathani — Agentic AI & Software Engineer building intelligent, user-centric applications.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    title: 'Mehdi Abbas Nathani — Portfolio',
    description:
      'Portfolio of Mehdi Abbas Nathani — Agentic AI & Software Engineer building intelligent, user-centric applications.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mehdi Abbas Nathani — Portfolio',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mehdi Abbas Nathani',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mehdinathani.com',
  jobTitle: 'Agentic AI & Software Engineer',
  description:
    'Portfolio of Mehdi Abbas Nathani — Agentic AI & Software Engineer building intelligent, user-centric applications.',
  sameAs: [
    'https://linkedin.com/in/mehdinathani',
    'https://github.com/mehdinathani',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="snap-container flex min-h-screen flex-col font-sans antialiased">
        <AnalyticsScript />
        <SmoothScroll />
        <PageProgress />
        <LiveRegion />
        <AnalyticsTracker />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#f5f5f7',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            },
          }}
        />
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <ScrollToTop />
        <Footer />
        <CommandPalette />
        <ChatSheet />
      </body>
    </html>
  )
}
