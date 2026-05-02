import type { Metadata } from 'next'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import dynamic from 'next/dynamic'
import '@/app/globals.css'

const ChatWidget = dynamic(() => import('@/components/chatbot/chat-widget').then(mod => mod.ChatWidget), { ssr: false })

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
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
