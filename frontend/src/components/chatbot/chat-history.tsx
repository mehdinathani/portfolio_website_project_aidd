'use client'

import { useEffect, useRef } from 'react'
import type { ChatMessage as ChatMessageType } from '@/hooks/use-chat'
import { ChatMessage } from './chat-message'

interface ChatHistoryProps {
  messages: ChatMessageType[]
  isLoading: boolean
}

export function ChatHistory({ messages, isLoading }: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      className="flex-1 overflow-y-auto bg-background px-4 py-3"
    >
      {messages.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Hi! Ask me anything about my projects, skills, or experience.
          </p>
        </div>
      )}

      {messages.map((msg, idx: number) => (
        <ChatMessage
          key={idx}
          role={msg.role}
          content={msg.content}
          sources={msg.sources}
        />
      ))}

      {isLoading && (
        <div className="mb-3 flex justify-start" aria-label="Assistant is typing">
          <div className="flex items-center gap-1 rounded-lg bg-secondary px-4 py-3">
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
