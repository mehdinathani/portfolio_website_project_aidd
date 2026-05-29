'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types/api'

interface SkillsClusterProps {
  skills: Skill[]
}

export default function SkillsCluster({ skills }: SkillsClusterProps) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  if (skills.length === 0) return null

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-12 text-3xl font-bold text-foreground">Skills</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => {
            const isActive = activeSkill === skill.id
            const isDimmed = activeSkill !== null && !isActive
            return (
              <button
                key={skill.id}
                onMouseEnter={() => setActiveSkill(skill.id)}
                onMouseLeave={() => setActiveSkill(null)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_12px_-2px_#3b82f6]'
                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/50 hover:text-foreground',
                  isDimmed && 'opacity-30',
                )}
              >
                {skill.name}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
