'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [text])

  if (done) {
    return (
      <div className="prose prose-sm prose-invert max-w-none break-words">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    )
  }

  return (
    <div className="prose prose-sm prose-invert max-w-none break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayed}</ReactMarkdown>
      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-accent" />
    </div>
  )
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-accent text-black rounded-br-sm'
            : 'bg-white/[0.06] text-white/80 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <TypewriterText text={content} />
        )}
      </div>
    </div>
  )
}
