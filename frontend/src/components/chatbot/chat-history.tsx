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
      className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50"
    >
      {messages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">
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
        <div className="flex justify-start mb-3" aria-label="Assistant is typing">
          <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
