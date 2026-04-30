import Link from 'next/link'
import ProjectCard from '@/components/sections/project-card'
import { api } from '@/lib/api'
import type { Project } from '@/types/api'

export const revalidate = 60

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ featured?: string }>
}) {
  const { featured } = await searchParams
  const showFeatured = featured === 'true'
  const projects = await api.getProjects(showFeatured) as Project[]

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>

        <div className="flex gap-2">
          <Link
            href="/projects"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !showFeatured
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </Link>
          <Link
            href="/projects?featured=true"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              showFeatured
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Featured
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No projects found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="block">
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
