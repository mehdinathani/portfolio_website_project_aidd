'use client'

import { useState, useCallback, useEffect } from 'react'
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
  const handleShaderError = useCallback(() => setShaderError(true), [])

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setDeferred(true), { timeout: 2000 })
    } else {
      setDeferred(true)
    }
  }, [])

  const show3D = canRender3D && deferred

  return (
    <section className="relative min-h-screen w-full overflow-hidden" aria-label="Hero">
      <ParallaxSection speed={-0.15}>
        {show3D ? (
          SHADER_ENABLED && !shaderError ? (
            <ShaderHero uReducedMotion={reducedMotion} onError={handleShaderError} />
          ) : (
            <ParticleField />
          )
        ) : (
          <HeroFallback />
        )}
      </ParallaxSection>
      <HeroMaskReveal>
        <HeroContent />
      </HeroMaskReveal>
    </section>
  )
}
