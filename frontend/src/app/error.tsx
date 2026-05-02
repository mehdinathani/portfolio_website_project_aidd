'use client'

import { useEffect } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900">Something went wrong!</h1>
      <p className="max-w-md text-gray-600">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Go Home
        </a>
      </div>
    </main>
  )
}
