'use client'

import AuroraBackground from '@/components/hero/aurora-background'
import HeroContent from '@/components/hero/hero-content'

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="snap-section relative w-full overflow-hidden"
      aria-label="Hero"
    >
      <AuroraBackground />
      <HeroContent />
    </section>
  )
}