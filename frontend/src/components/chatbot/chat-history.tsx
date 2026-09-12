'use client'

import { useEffect, useRef } from 'react'
import type { ChatMessage as ChatMessageType } from '@/hooks/use-chat'
import { ChatMessage } from './chat-message'

const SUGGESTED_QUESTIONS = [
  'What projects have you worked on?',
  'What are your top skills?',
  'Tell me about your experience',
  'What technologies do you use?',
]

interface ChatHistoryProps {
  messages: ChatMessageType[]
  isLoading: boolean
  onSuggestedQuestion?: (question: string) => void
}

export function ChatHistory({ messages, isLoading, onSuggestedQuestion }: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      className="flex-1 overflow-y-auto px-4 py-3"
    >
      {messages.length === 0 && (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="mb-1 text-sm font-medium text-white">Hey! I&apos;m Mehdi&apos;s AI assistant</p>
          <p className="mb-4 text-xs text-white/50">
            Ask me anything about projects, skills, or experience
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => onSuggestedQuestion?.(q)}
                className="rounded-full border border-white/[0.15] px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-accent/50 hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, idx: number) => (
        <ChatMessage
          key={idx}
          role={msg.role}
          content={msg.content}
        />
      ))}

      {isLoading && (
        <div className="mb-3 flex justify-start" aria-label="Assistant is typing">
          <div className="flex items-center gap-1 rounded-lg bg-white/[0.05] px-4 py-3">
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/30 [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/30 [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/30 [animation-delay:300ms]" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
