'use client'

import dynamic from 'next/dynamic'
import { useCanRender3D } from '@/hooks/use-reduced-motion'
import HeroContent from '@/components/hero/hero-content'
import HeroFallback from '@/components/hero/hero-fallback'

const ParticleField = dynamic(() => import('@/components/hero/particle-field'), { ssr: false })

export default function HeroSection() {
  const canRender3D = useCanRender3D()

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {canRender3D ? <ParticleField /> : <HeroFallback />}
      <HeroContent />
    </section>
  )
}
