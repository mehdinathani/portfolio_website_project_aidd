'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useCanRender3D, useReducedMotion } from '@/hooks/use-reduced-motion'
import HeroContent from '@/components/hero/hero-content'
import HeroFallback from '@/components/hero/hero-fallback'
import HeroMaskReveal from '@/components/hero/hero-mask-reveal'
import ParallaxSection from '@/components/motion/parallax-section'

const ParticleField = dynamic(() => import('@/components/hero/particle-field'), { ssr: false })
const ShaderHero = dynamic(() => import('@/components/hero/shader-hero'), { ssr: false })

const SHADER_ENABLED = process.env.NEXT_PUBLIC_HERO_SHADER !== 'false'

export default function HeroSection() {
  const canRender3D = useCanRender3D()
  const reducedMotion = useReducedMotion()
  const [shaderError, setShaderError] = useState(false)
  const [deferred, setDeferred] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null!)
  const handleShaderError = useCallback(() => setShaderError(true), [])

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setDeferred(true), { timeout: 1000 })
    } else {
      setDeferred(true)
    }
  }, [])

  useEffect(() => {
    if (deferred && overlayRef.current) {
      requestAnimationFrame(() => {
        overlayRef.current.style.opacity = '1'
      })
    }
  }, [deferred])

  const show3D = canRender3D

  return (
    <section className="relative min-h-screen w-full overflow-hidden" aria-label="Hero">
      <ParallaxSection speed={-0.15}>
        <HeroFallback />
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{ opacity: 0, transition: 'opacity 0.8s ease' }}
        >
          {show3D && deferred && (
            SHADER_ENABLED && !shaderError ? (
              <ShaderHero uReducedMotion={reducedMotion} onError={handleShaderError} />
            ) : (
              <ParticleField />
            )
          )}
        </div>
      </ParallaxSection>
      <HeroMaskReveal>
        <HeroContent />
      </HeroMaskReveal>
    </section>
  )
}
