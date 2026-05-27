'use client'

import { useState, useEffect } from 'react'
import { useChat, ChatMessage } from '@/hooks/use-chat'
import { ChatHistory } from './chat-history'
import { ChatInput } from './chat-input'
import { ChatLeadForm } from './chat-lead-form'

export function ChatWidget() {
  const { messages, sendMessage, loading, error } = useChat()
  const [isOpen, setIsOpen] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)

  const handleSend = async (message: string) => {
    const result = await sendMessage(message)
    if (result.lead_intent) {
      setShowLeadForm(true)
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          isOpen ? 'bg-gray-700 rotate-90' : 'bg-blue-600 animate-bounce'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Chat with Mehdi's AI assistant"
          className={`fixed z-40 flex flex-col rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden
                     w-80 sm:w-96 h-[500px]
                     sm:bottom-24 sm:right-6 sm:rounded-xl sm:h-[500px]
                     max-sm:inset-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:bottom-0 max-sm:right-0
                     transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">Chat with Me</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 hover:bg-blue-700 transition-colors sm:hidden"
              aria-label="Close chat"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <ChatHistory messages={messages} isLoading={loading} />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mx-3 mb-2">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Lead Form */}
          {showLeadForm && (
            <div className="border-t border-gray-200 p-3 bg-white">
              <ChatLeadForm
                onSubmitSuccess={() => {
                  // Keep the form mounted briefly so the "Thank you!" success
                  // state is visible to the user before the form unmounts.
                  setTimeout(() => setShowLeadForm(false), 3000)
                }}
              />
            </div>
          )}

          {/* Input */}
          {!showLeadForm && (
            <ChatInput
              onSend={handleSend}
              isLoading={loading}
              placeholder="Type a message..."
              maxLength={2000}
            />
          )}
        </div>
      )}
    </>
  )
}
