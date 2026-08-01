'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface SharedLayoutProps {
  children: React.ReactNode
  layoutId: string
  className?: string
}

export default function SharedLayout({ children, layoutId, className }: SharedLayoutProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className={cn(className)}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
