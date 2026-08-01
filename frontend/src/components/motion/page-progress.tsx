'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PageProgress() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      className="fixed left-0 top-0 z-[9999] h-0.5 bg-primary transition-all duration-300"
      style={{
        width: loading ? '90%' : '0%',
        opacity: loading ? 1 : 0,
        transition: loading ? 'width 30s ease' : 'opacity 0.3s ease, width 0.3s ease',
      }}
    />
  )
}
