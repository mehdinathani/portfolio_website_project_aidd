'use client'

import { useState, FormEvent } from 'react'

interface ChatLeadFormProps {
  onSubmitSuccess?: () => void
}

export function ChatLeadForm({ onSubmitSuccess }: ChatLeadFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiUrl}/api/v1/leads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          category: 'chatbot_capture',
          source: 'chatbot',
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.detail || `Failed to submit: ${response.status}`)
      }

      setSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
      onSubmitSuccess?.()
    } catch (e: any) {
      setError(e.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 text-center">
        <svg
          className="mx-auto mb-2 h-8 w-8 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm font-medium text-white">Thank you!</p>
        <p className="mt-1 text-xs text-white/50">
          Your message has been sent. I'll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-4">
      <p className="mb-3 text-sm font-medium text-white">
        I'd love to hear from you! Please leave your details below.
      </p>

      {error && (
        <div className="mb-3 rounded border border-destructive/20 bg-destructive/5 p-2">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="lead-name" className="mb-1 block text-xs font-medium text-white/50">
            Name
          </label>
          <input
            id="lead-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-accent/50"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="lead-email" className="mb-1 block text-xs font-medium text-white/50">
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-accent/50"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="lead-message" className="mb-1 block text-xs font-medium text-white/50">
            Message
          </label>
          <textarea
            id="lead-message"
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-none rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-accent/50"
            placeholder="What would you like to discuss?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-black transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
