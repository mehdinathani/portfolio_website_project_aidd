'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return
    const gtag = (window as any).gtag
    if (gtag) {
      gtag('config', GA_ID, {
        page_path: pathname,
        page_title: document.title,
      })
    }
  }, [pathname])

  return null
}
