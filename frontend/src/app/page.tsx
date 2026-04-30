import Hero from '@/components/sections/hero'
import ProjectCard from '@/components/sections/project-card'
import { api } from '@/lib/api'
import type { Profile, Project } from '@/types/api'

export const revalidate = 60

export default async function HomePage() {
  const [profile, projects] = await Promise.all([
    api.getProfile() as Promise<Profile>,
    api.getProjects(true) as Promise<Project[]>,
  ])

  return (
    <main>
      <Hero profile={profile} />

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Featured Projects
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
