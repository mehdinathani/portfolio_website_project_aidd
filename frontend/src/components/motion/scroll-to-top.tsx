'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-6 left-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-black/80 text-white/60 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:text-accent',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none',
      )}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}
