'use client'

import { BrainCircuit, Sparkles, Languages, Network, FileSearch, Workflow, Database, ScanEye, Bot, Layers } from 'lucide-react'
import Marquee from '@/components/motion/marquee'
import type { Skill } from '@/types/api'

interface SkillsClusterProps {
  skills: Skill[]
}

const FALLBACK_ICONS = [BrainCircuit, Sparkles, Languages, Network, FileSearch, Workflow, Database, ScanEye, Bot, Layers]

export default function SkillsCluster({ skills }: SkillsClusterProps) {
  if (skills.length === 0) return null

  const chips = skills.map((skill, i) => ({
    id: skill.id,
    name: skill.name,
    Icon: FALLBACK_ICONS[i % FALLBACK_ICONS.length],
  }))

  const mid = Math.ceil(chips.length / 2)
  const row1 = chips.slice(0, mid)
  const row2 = chips.slice(mid)

  return (
    <section className="marquee-fade flex w-full flex-col items-center justify-center gap-6 overflow-hidden">
      <p className="type-label text-accent/80">What I work with</p>
      <Marquee speed={28} direction="left">
        {row1.map((chip) => (
          <Chip key={chip.id} name={chip.name} Icon={chip.Icon} />
        ))}
      </Marquee>
      <Marquee speed={28} direction="right">
        {row2.map((chip) => (
          <Chip key={chip.id} name={chip.name} Icon={chip.Icon} />
        ))}
      </Marquee>
    </section>
  )
}

function Chip({ name, Icon }: { name: string; Icon: typeof BrainCircuit }) {
  return (
    <span className="type-caption inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-white/50">
      <Icon className="h-3.5 w-3.5" />
      {name}
    </span>
  )
}