'use client'

import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
}

export default function Marquee({
  children,
  className,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'flex overflow-hidden',
        pauseOnHover && '[&:hover>div]:[animation-play-state:paused]',
        className,
      )}
    >
      <div
        className="flex shrink-0 gap-8"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
