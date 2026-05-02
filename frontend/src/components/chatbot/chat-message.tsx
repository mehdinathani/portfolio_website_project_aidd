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
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {fallback && (
          <p className={`mt-2 text-xs italic ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
            (This answer is based on general knowledge. For the most accurate information, please contact me directly.)
          </p>
        )}

        {!isUser && sources && sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-1">Sources:</p>
            <ul className="space-y-1">
              {sources.map((src, idx) => (
                <li key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                  <svg
                    className="w-3 h-3 shrink-0"
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
                  <span className="shrink-0 text-gray-400">
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
