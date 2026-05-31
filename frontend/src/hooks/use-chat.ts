'use client'
import { useState, useCallback, useEffect } from 'react'
import { api } from '@/lib/api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ source: string; similarity: number }>
}

const STORAGE_KEY = 'portfolio-chat-history'
const SESSION_KEY = 'portfolio-chat-session'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    let sid = sessionStorage.getItem(SESSION_KEY)
    if (!sid) {
      sid = crypto.randomUUID()
      sessionStorage.setItem(SESSION_KEY, sid)
    }
    setSessionId(sid)

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatMessage[]
        setMessages(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

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
