'use client'

import { useState, useCallback } from 'react'

export default function LiveRegion() {
  const [announcement, setAnnouncement] = useState('')

  const announce = useCallback((message: string) => {
    setAnnouncement(message)
  }, [])

  if (typeof window !== 'undefined') {
    ;(window as any).__announce = announce
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}
