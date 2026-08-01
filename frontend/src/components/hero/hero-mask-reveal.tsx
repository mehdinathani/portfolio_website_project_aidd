'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface HeroMaskRevealProps {
  children: React.ReactNode
}

const REVEAL_RADIUS = 260

export default function HeroMaskReveal({ children }: HeroMaskRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const container = containerRef.current
    const overlay = overlayRef.current
    if (!container || !overlay) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      overlay.style.setProperty('--mask-x', `${e.clientX - rect.left}px`)
      overlay.style.setProperty('--mask-y', `${e.clientY - rect.top}px`)

      const target = e.target as HTMLElement | null
      const overText = !!target?.closest('[data-mask-target]')
      overlay.style.setProperty('--mask-r', overText ? `${REVEAL_RADIUS}px` : '0px')
    }

    const onLeave = () => {
      overlay.style.setProperty('--mask-r', '0px')
    }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onLeave)

    return () => {
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [reducedMotion])

  // Spotlight is a pure visual enhancement: skip the overlay entirely when motion
  // is reduced so there is no duplicated DOM and no listeners.
  if (reducedMotion) {
    return <div className="relative">{children}</div>
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Interactive base layer — the only copy in the a11y tree / tab order. */}
      <div className="relative z-10">{children}</div>

      {/* Visual-only spotlight overlay: same markup for pixel-perfect alignment,
          removed from a11y tree and tab order so buttons/links aren't duplicated. */}
      <div
        ref={overlayRef}
        className="hero-mask-overlay pointer-events-none absolute inset-0 z-20"
        aria-hidden="true"
        // @ts-expect-error -- `inert` is valid HTML; types lag in this React version
        inert=""
      >
        {children}
      </div>
    </div>
  )
}
