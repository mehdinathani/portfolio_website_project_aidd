import type { Skill } from '@/types/api'

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'bg-green-50 text-green-700',
  backend: 'bg-purple-50 text-purple-700',
  devops: 'bg-orange-50 text-orange-700',
  ai: 'bg-blue-50 text-blue-700',
  database: 'bg-yellow-50 text-yellow-700',
  other: 'bg-gray-50 text-gray-700',
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.other
}

function ProficiencyDots({ level }: { level: number }) {
  const filled = Math.round(level / 20)
  return (
    <div className="flex gap-1" aria-label={`Proficiency: ${level}%`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${i <= filled ? 'bg-blue-600' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  )
}

interface SkillBadgeProps {
  skill: Skill
}

export default function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-900">{skill.name}</span>
        <span
          className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(skill.category)}`}
        >
          {skill.category}
        </span>
      </div>
      <ProficiencyDots level={skill.proficiency} />
    </div>
  )
}
