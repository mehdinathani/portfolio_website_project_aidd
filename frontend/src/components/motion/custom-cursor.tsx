'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }

    document.addEventListener('mousemove', onMouseMove)

    let raf: number
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12
      pos.current.y += (target.current.y - pos.current.y) * 0.12

      const el = ringRef.current
      if (el) {
        el.style.left = `${pos.current.x}px`
        el.style.top = `${pos.current.y}px`
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onHoverIn = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '48px'
        ringRef.current.style.height = '48px'
        ringRef.current.style.borderColor = 'hsl(217 91% 60%)'
        ringRef.current.style.backgroundColor = 'hsla(217 91% 60% / 0.06)'
      }
    }

    const onHoverOut = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '28px'
        ringRef.current.style.height = '28px'
        ringRef.current.style.borderColor = 'hsla(60 5% 96% / 0.4)'
        ringRef.current.style.backgroundColor = 'transparent'
      }
    }

    document.querySelectorAll('a, button, input, textarea, select, [role="button"], img, video').forEach(el => {
      el.addEventListener('mouseenter', onHoverIn)
      el.addEventListener('mouseleave', onHoverOut)
    })

    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, input, textarea, select, [role="button"], img, video').forEach(el => {
        el.removeEventListener('mouseenter', onHoverIn)
        el.removeEventListener('mouseleave', onHoverOut)
        el.addEventListener('mouseenter', onHoverIn)
        el.addEventListener('mouseleave', onHoverOut)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
      observer.disconnect()
      document.querySelectorAll('a, button, input, textarea, select, [role="button"], img, video').forEach(el => {
        el.removeEventListener('mouseenter', onHoverIn)
        el.removeEventListener('mouseleave', onHoverOut)
      })
    }
  }, [])

  return (
    <div
      ref={ringRef}
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: '1.5px solid hsla(60 5% 96% / 0.4)',
        transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background-color 0.25s ease',
        left: '0px',
        top: '0px',
      }}
    >
      <div
        className="absolute inset-[6px] rounded-full bg-foreground/30"
        style={{
          transition: 'opacity 0.25s ease',
        }}
      />
    </div>
  )
}
