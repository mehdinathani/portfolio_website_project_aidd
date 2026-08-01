'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import MagneticButton from '@/components/motion/magnetic-button'

export default function HeroContent() {
  // {{HERO_COPY}} — Replace with personal one-liner
  const headline = 'Building at the'
  const subline = 'intersection of AI & product.'
  const tagline = 'I craft intelligent applications that ship real value — from conversational agents to production-grade ML pipelines.'

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8"
      >
        <div className="rounded-full bg-gradient-to-b from-primary via-purple-500 to-primary p-[3px] shadow-lg shadow-primary/20">
          <Image
            src="/portrait_self_mehdi_enhanced.webp"
            alt="Mehdi Nathani"
            width={120}
            height={120}
            className="aspect-square rounded-full object-cover"
            priority
          />
        </div>
      </motion.div>

      <motion.h1
        data-mask-target
        className="max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-7xl md:text-8xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {headline} <br />
        <span className="text-primary">{subline}</span>
      </motion.h1>

      <motion.p
        data-mask-target
        className="mt-6 max-w-xl text-lg text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {tagline}
      </motion.p>

      <motion.div
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <MagneticButton>
          <Button variant="default" size="lg" asChild>
            <a href="https://cal.com/mehdinathani" target="_blank" rel="noopener noreferrer">
              Book a call &rarr;
            </a>
          </Button>
        </MagneticButton>
        <MagneticButton>
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">
              View Projects
            </Link>
          </Button>
        </MagneticButton>
      </motion.div>

      <motion.p
        className="mt-4 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Press <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">⌘K</kbd> to navigate
      </motion.p>
    </div>
  )
}
