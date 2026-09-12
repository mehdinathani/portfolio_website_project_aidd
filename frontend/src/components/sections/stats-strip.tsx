'use client'

import { useRef, useState, useEffect } from 'react'
import { useInView } from 'motion/react'
import { cn } from '@/lib/utils'

interface Stat {
  value: string
  label: string
  numeric?: number
  suffix?: string
}

interface StatsStripProps {
  stats: Stat[]
  className?: string
}

function AnimatedStat({ stat, isActive }: { stat: Stat; isActive: boolean }) {
  const numeric = stat.numeric ?? (parseInt(stat.value.replace(/[^0-9]/g, '')) || 0)
  const suffix = stat.suffix ?? (stat.value.includes('+') ? '+' : '+')
  const [count, setCount] = useState(numeric)

  useEffect(() => {
    if (!isActive) return

    const duration = 2000
    const steps = 60

    const start = performance.now()
    const frame = setInterval(() => {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * numeric))

      if (progress >= 1) {
        clearInterval(frame)
      }
    }, duration / steps)

    return () => clearInterval(frame)
  }, [isActive, numeric])

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
        {count}
        {suffix}
      </span>
      <span className="type-label text-white/35">
        {stat.label}
      </span>
    </div>
  )
}

export default function StatsStrip({ stats, className }: StatsStripProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  if (stats.length === 0) return null

  return (
    <section className={cn('flex items-center justify-center', className)}>
      <div
        ref={ref}
        className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4 md:py-20"
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              'flex justify-center md:px-6',
              i < stats.length - 1 && 'md:border-r md:border-white/[0.06]'
            )}
          >
            <AnimatedStat stat={stat} isActive={isInView} />
          </div>
        ))}
      </div>
    </section>
  )
}