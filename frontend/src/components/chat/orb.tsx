'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Sparkles } from 'lucide-react'

interface ChatOrbProps {
  onClick: () => void
  isOpen: boolean
}

export default function ChatOrb({ onClick, isOpen }: ChatOrbProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 animate-fade-in">
          <div className="relative rounded-lg bg-accent px-3 py-2 text-xs text-black shadow-lg">
            Ask me anything!
            <div className="absolute bottom-0 right-4 h-2 w-2 translate-y-1/2 rotate-45 bg-accent" />
          </div>
        </div>
      )}
      <button
        onClick={() => { onClick(); setShowTooltip(false) }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black shadow-[0_0_24px_rgba(112,255,216,0.25)] transition-all hover:scale-110 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2"
        aria-label="Open chat"
      >
        <div className="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-10" />
        <div className="relative flex items-center justify-center">
          <MessageSquare className="h-5 w-5 transition-all group-hover:scale-110" />
        </div>
        <div className="absolute -right-1 -top-1">
          <Sparkles className="h-3.5 w-3.5 text-black/60" />
        </div>
      </button>
    </div>
  )
}
