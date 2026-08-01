'use client'

import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

export function useCanRender3D(): boolean {
  const reduced = useReducedMotion()
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const lowCpu = navigator.hardwareConcurrency < 4
    const narrow = window.innerWidth < 768
    const next = !reduced && !isTouch && !lowCpu && !narrow
    if (canRender !== next) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanRender(next)
    }
  }, [reduced, canRender])

  return canRender
}
