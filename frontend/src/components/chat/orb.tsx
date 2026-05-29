'use client'

import { MessageSquare } from 'lucide-react'

interface ChatOrbProps {
  onClick: () => void
  isOpen: boolean
}

export default function ChatOrb({ onClick, isOpen }: ChatOrbProps) {
  if (isOpen) return null

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-background/80 text-foreground shadow-lg backdrop-blur-md border border-border/40 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary animate-[pulseSoft_3s_ease-in-out_infinite]"
      aria-label="Open chat"
    >
      <MessageSquare className="h-5 w-5" />
    </button>
  )
}
