import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { Project } from '@/types/api'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 60

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const project = await api.getProject(id) as Project

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/projects"
        className="mb-6 inline-block text-sm text-blue-600 transition-colors hover:text-blue-700"
      >
        &larr; Back to Projects
      </Link>

      {project.image_url && (
        <Image
          src={project.image_url}
          alt={project.title}
          width={1200}
          height={600}
          className="mb-8 w-full rounded-xl object-cover shadow-md"
        />
      )}

      <h1 className="mb-2 text-3xl font-bold text-gray-900">{project.title}</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {project.tech_stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="leading-relaxed text-gray-700">{project.description}</p>
      </div>

      {(project.start_date || project.end_date) && (
        <p className="mt-6 text-sm text-gray-500">
          {project.start_date}
          {project.end_date ? ` — ${project.end_date}` : ''}
        </p>
      )}

      <div className="mt-8 flex gap-4">
        {project.project_url && (
          <Link
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700"
          >
            Live Demo
          </Link>
        )}
        {project.github_url && (
          <Link
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            GitHub
          </Link>
        )}
      </div>
    </main>
  )
}
