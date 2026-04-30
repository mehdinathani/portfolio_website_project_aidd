import type { Metadata } from 'next'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import dynamic from 'next/dynamic'
const ChatWidget = dynamic(() => import('@/components/chatbot/chat-widget').then(mod => mod.default), { ssr: false })

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
      <body className="flex min-h-screen flex-col font-sans text-gray-900 antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  )
}
