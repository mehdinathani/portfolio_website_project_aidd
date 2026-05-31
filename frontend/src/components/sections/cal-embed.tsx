'use client'

import { useState } from 'react'

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL || 'https://cal.com/mehdinathani'

export default function CalEmbed() {
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative mx-auto max-w-3xl">
      {loading && (
        <div className="flex h-[600px] items-center justify-center rounded-xl border border-border bg-secondary">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading calendar...</p>
          </div>
        </div>
      )}
      <iframe
        src={`${CAL_URL}/embed`}
        className={`h-[600px] w-full rounded-xl border border-border transition-opacity duration-300 ${loading ? 'absolute inset-0 opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        title="Book a call"
        allow="camera;microphone"
      />
    </div>
  )
}
