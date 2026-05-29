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
    <main className="mx-auto max-w-4xl px-6 py-24">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Back to Projects
      </Link>

      <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        {project.title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech_stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="prose prose-invert mt-8 max-w-none text-muted-foreground">
        <p className="text-lg leading-relaxed">{project.description}</p>
      </div>

      {(project.start_date || project.end_date) && (
        <p className="mt-6 text-sm text-muted-foreground">
          {project.start_date}
          {project.end_date ? ` — ${project.end_date}` : ''}
        </p>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        {project.project_url && (
          <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Live Demo &rarr;
          </a>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            GitHub &rarr;
          </a>
        )}
      </div>
    </main>
  )
}
