'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Source {
  source: string
  similarity: number
}

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  fallback?: boolean
}

export function ChatMessage({ role, content, sources, fallback }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-secondary text-secondary-foreground rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {fallback && (
          <p className={`mt-2 text-xs italic ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            (This answer is based on general knowledge. For the most accurate information, please contact me directly.)
          </p>
        )}

        {!isUser && sources && sources.length > 0 && (
          <div className="mt-2 border-t border-border pt-2">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">Sources:</p>
            <ul className="space-y-1">
              {sources.map((src, idx) => (
                <li key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg
                    className="h-3 w-3 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <span className="truncate">{src.source}</span>
                  <span className="shrink-0 text-muted-foreground/60">
                    ({Math.round(src.similarity * 100)}% match)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
