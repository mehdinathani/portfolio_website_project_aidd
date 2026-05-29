'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onMouseMove = (e: MouseEvent) => {
      const el = cursorRef.current
      if (!el) return

      el.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`

      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"]')
      const isMedia = target.closest('img, video, [data-media]')

      if (isMedia) {
        el.style.width = '48px'
        el.style.height = '48px'
        el.style.borderRadius = '24px'
        el.textContent = 'view'
      } else if (isInteractive) {
        el.style.width = '32px'
        el.style.height = '32px'
        el.style.borderRadius = '16px'
        el.textContent = ''
      } else {
        el.style.width = '12px'
        el.style.height = '12px'
        el.style.borderRadius = '6px'
        el.textContent = ''
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center bg-foreground text-[8px] font-medium text-background mix-blend-difference"
      style={{
        width: '12px',
        height: '12px',
        borderRadius: '6px',
        transition: 'width 0.15s ease, height 0.15s ease, border-radius 0.15s ease',
        transform: 'translate(0, 0)',
      }}
    />
  )
}
