'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface RevealSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function RevealSection({ children, className, delay = 0 }: RevealSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
