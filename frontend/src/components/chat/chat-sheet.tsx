'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import FocusTrap from 'focus-trap-react'
import { useChat } from '@/hooks/use-chat'
import ChatOrb from '@/components/chat/orb'
import { ChatHistory } from '@/components/chatbot/chat-history'
import { ChatInput } from '@/components/chatbot/chat-input'
import { ChatLeadForm } from '@/components/chatbot/chat-lead-form'

export default function ChatSheet() {
  const [open, setOpen] = useState(false)
  const { messages, sendMessage, loading, error } = useChat()
  const [showLeadForm, setShowLeadForm] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener('open-chat', handler)
    return () => document.removeEventListener('open-chat', handler)
  }, [])

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [open])

  const handleSend = async (message: string) => {
    const result = await sendMessage(message)
    if (result.lead_intent) {
      setShowLeadForm(true)
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <>
      <ChatOrb onClick={() => setOpen(true)} isOpen={open} />

      <FocusTrap
        active={open}
        focusTrapOptions={{
          onDeactivate: () => setOpen(false),
          clickOutsideDeactivates: true,
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Mehdi&apos;s AI assistant"
          className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-[#0b0b0c] border-l border-white/[0.08] shadow-2xl transition-transform duration-300 sm:w-96 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            backgroundImage: 'radial-gradient(ellipse at 20% 50%, hsla(174 100% 72% / 0.04) 0%, transparent 50%)',
          }}
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-white">Chat with Me</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-white/40 transition-colors hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <ChatHistory messages={messages} isLoading={loading} onSuggestedQuestion={handleSend} />

          {error && (
            <div className="mx-3 mb-2 rounded-lg border border-destructive/20 bg-destructive/5 p-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {showLeadForm && (
            <div className="border-t border-white/[0.08] p-3">
              <ChatLeadForm
                onSubmitSuccess={() => {
                  setTimeout(() => setShowLeadForm(false), 3000)
                }}
              />
            </div>
          )}

          {!showLeadForm && (
            <ChatInput
              onSend={handleSend}
              isLoading={loading}
              placeholder="Type a message..."
              maxLength={2000}
            />
          )}
        </div>
      </FocusTrap>
    </>
  )
}
