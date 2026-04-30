import SkillBadge from '@/components/sections/skill-badge'
import { api } from '@/lib/api'

export const revalidate = 60

export default async function SkillsPage() {
  const skills = await api.getSkills() as Array<{
    id: string
    name: string
    category: string
    proficiency: number
    icon_url?: string
    order_index: number
  }>

  // Group by category
  const grouped: Record<string, typeof skills> = {}
  for (const skill of skills) {
    const cat = skill.category || 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(skill)
  }

  const categoryOrder = ['frontend', 'backend', 'ai', 'devops', 'database', 'other']
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => (categoryOrder.indexOf(a.toLowerCase()) + 1) - (categoryOrder.indexOf(b.toLowerCase()) + 1)
  )

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 text-center text-3xl font-bold text-gray-900">Skills</h1>

      {sortedCategories.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No skills found.</p>
      ) : (
        <div className="space-y-10">
          {sortedCategories.map((category) => (
            <section key={category}>
              <h2 className="mb-4 text-xl font-semibold capitalize text-gray-800">
                {category}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[category]
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((skill) => (
                    <SkillBadge key={skill.id} skill={skill as any} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
