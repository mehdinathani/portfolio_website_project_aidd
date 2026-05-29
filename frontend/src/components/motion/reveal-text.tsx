'use client'

import { motion } from 'motion/react'

interface RevealTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function RevealText({ text, className, delay = 0, stagger = 0.05, as: Tag = 'p' }: RevealTextProps) {
  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: delay + i * stagger, ease: 'easeOut' }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </Tag>
  )
}
