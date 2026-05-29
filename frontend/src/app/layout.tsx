import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import PageTransition from '@/components/motion/page-transition'
import dynamic from 'next/dynamic'
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

const CustomCursor = dynamic(() => import('@/components/motion/custom-cursor'), { ssr: false })
const CommandPalette = dynamic(() => import('@/components/motion/command-palette'), { ssr: false })
const ChatSheet = dynamic(() => import('@/components/chat/chat-sheet'), { ssr: false })

export const metadata: Metadata = {
  title: {
    default: 'Mehdi Abbas Nathani — Portfolio',
    template: '%s | Mehdi Abbas Nathani',
  },
  description:
    'Portfolio of Mehdi Abbas Nathani — Agentic AI & Software Engineer building intelligent, user-centric applications.',
  openGraph: {
    type: 'website',
    title: 'Mehdi Abbas Nathani — Portfolio',
    description:
      'Portfolio of Mehdi Abbas Nathani — Agentic AI & Software Engineer building intelligent, user-centric applications.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <main className="flex-1 pt-16">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <CustomCursor />
        <CommandPalette />
        <ChatSheet />
      </body>
    </html>
  )
}
