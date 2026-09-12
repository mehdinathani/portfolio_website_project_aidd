'use client'

import { useEffect } from 'react'
import Link from 'next/link'

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
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6">
      <div className="relative mx-auto max-w-md text-center">
        <svg
          className="mx-auto h-32 w-32 text-destructive/20"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="25" y="30" width="50" height="45" rx="4" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="55" r="10" stroke="currentColor" strokeWidth="1" />
          <path d="M35 70 L40 75 L50 65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        </svg>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">
          Something glitched
        </h1>
        <p className="mt-3 text-white/50">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-black transition-all hover:brightness-110"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/[0.15] px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-white/[0.15] px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            Projects
          </Link>
        </div>
      </div>
    </main>
  )
}
