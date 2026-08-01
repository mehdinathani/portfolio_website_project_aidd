'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types/api'

interface SkillsClusterProps {
  skills: Skill[]
}

export default function SkillsCluster({ skills }: SkillsClusterProps) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const [focusIndex, setFocusIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  if (skills.length === 0) return null

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const count = skills.length
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        setFocusIndex((prev) => (prev + 1) % count)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        setFocusIndex((prev) => (prev - 1 + count) % count)
        break
      case 'Home':
        e.preventDefault()
        setFocusIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusIndex(count - 1)
        break
    }
  }, [skills.length])

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-12 text-3xl font-bold text-foreground">Skills</h2>
        <div
          ref={containerRef}
          role="listbox"
          aria-label="Skills"
          aria-orientation="horizontal"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex flex-wrap justify-center gap-3 focus:outline-none"
        >
          {skills.map((skill, index) => {
            const isActive = activeSkill === skill.id
            const isDimmed = activeSkill !== null && !isActive
            const isFocused = focusIndex === index
            return (
              <motion.button
                key={skill.id}
                role="option"
                aria-selected={isActive}
                tabIndex={isFocused ? 0 : -1}
                onMouseEnter={() => setActiveSkill(skill.id)}
                onMouseLeave={() => setActiveSkill(null)}
                onFocus={() => setFocusIndex(index)}
                onClick={() => setActiveSkill(isActive ? null : skill.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300',
                  isActive
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_12px_-2px_#3b82f6]'
                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/50 hover:text-foreground',
                  isDimmed && 'opacity-30',
                  isFocused && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
                )}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                whileInView={{ scale: [0.8, 1.05, 1] }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {skill.name}
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
