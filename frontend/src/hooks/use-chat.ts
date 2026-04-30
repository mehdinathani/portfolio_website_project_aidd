'use client'
import { useState, useCallback } from 'react'
import { api } from '@/lib/api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ source: string; similarity: number }>
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId] = useState(() => crypto.randomUUID())

  const sendMessage = useCallback(async (message: string) => {
    const userMsg: ChatMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const response = await api.sendChatMessage({
        message,
        session_id: sessionId,
        history,
      })
      const botMsg: ChatMessage = {
        role: 'assistant',
        content: response.response,
        sources: response.sources,
      }
      setMessages(prev => [...prev, botMsg])
      return { lead_intent: response.lead_intent, lead_prompt: response.lead_prompt }
    } catch (e: any) {
      setError(e.message || 'Failed to send message')
      return { lead_intent: false, lead_prompt: null }
    } finally {
      setLoading(false)
    }
  }, [messages, sessionId])

  return { messages, sendMessage, loading, error, sessionId }
}
