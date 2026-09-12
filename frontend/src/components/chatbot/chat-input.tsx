'use client'

import { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  placeholder?: string
  maxLength?: number
}

export function ChatInput({
  onSend,
  isLoading,
  placeholder = 'Type a message...',
  maxLength = 2000,
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [isLoading])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2 border-t border-white/[0.08] px-3 py-3">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            setInput(e.target.value)
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        maxLength={maxLength}
        aria-label="Chat message"
        className="flex-1 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-accent/50 disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
        className="rounded-full bg-accent p-2 text-black transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Send message"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </div>
  )
}
