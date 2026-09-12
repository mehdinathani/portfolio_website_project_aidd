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
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}