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
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setCount(0)
      return
    }

    const duration = 2000
    const steps = 60
    const increment = numeric / steps
    let current = 0
    let frame: ReturnType<typeof setInterval>

    const start = performance.now()
    frame = setInterval(() => {
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
    <div className="flex flex-col items-center gap-1 md:items-start">
      <span className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        {count}
        {suffix}
      </span>
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
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
    <section className={cn('border-y border-border/40', className)}>
      <div
        ref={ref}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4 md:gap-0 md:py-20"
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              'flex justify-center md:justify-start md:px-8',
              i < stats.length - 1 && 'md:border-r md:border-border/40'
            )}
          >
            <AnimatedStat stat={stat} isActive={isInView} />
          </div>
        ))}
      </div>
    </section>
  )
}
