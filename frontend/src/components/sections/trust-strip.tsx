'use client'

import { motion } from 'motion/react'

const stats = [
  { value: '5+', label: 'Projects Delivered' },
  { value: '3+', label: 'Years Building' },
  { value: '10+', label: 'Technologies' },
  { value: '100%', label: 'Client Satisfaction' },
]

export default function TrustStrip() {
  return (
    <section className="flex items-center justify-center px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center"
            >
              <p className="type-headline text-white">{stat.value}</p>
              <p className="type-caption mt-1 text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}