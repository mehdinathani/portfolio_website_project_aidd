'use client'

import { motion } from 'motion/react'
import RevealSection from '@/components/motion/reveal-section'

const stats = [
  { value: '5+', label: 'Projects Delivered' },
  { value: '3+', label: 'Years Building' },
  { value: '10+', label: 'Technologies' },
  { value: '100%', label: 'Client Satisfaction' },
]

export default function TrustStrip() {
  return (
    <RevealSection>
      <section className="border-y border-border/40 bg-secondary/30 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <motion.p
                  className="text-3xl font-bold text-primary md:text-4xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {stat.value}
                </motion.p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </RevealSection>
  )
}
