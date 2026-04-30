import TimelineItem from '@/components/sections/timeline-item'
import { api } from '@/lib/api'
import type { Experience } from '@/types/api'

export const revalidate = 60

export default async function ExperiencePage() {
  const experiences = await api.getExperience() as Experience[]

  const sorted = [...experiences].sort((a, b) => a.order_index - b.order_index)

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-10 text-center text-3xl font-bold text-gray-900">Experience</h1>

      {sorted.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No experience entries found.</p>
      ) : (
        <div className="relative ml-1.5 border-l border-gray-200 pl-6">
          {sorted.map((exp, i) => (
            <TimelineItem key={exp.id} experience={exp} isLast={i === sorted.length - 1} />
          ))}
        </div>
      )}
    </main>
  )
}
