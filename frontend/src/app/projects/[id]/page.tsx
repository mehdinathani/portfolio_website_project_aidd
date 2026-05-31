import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/api'
import type { Project } from '@/types/api'
import type { Metadata } from 'next'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const project = await api.getProject(id) as Project
  return {
    title: project.title,
    description: project.short_description || project.description?.slice(0, 160),
    openGraph: project.image_url ? {
      images: [{ url: project.image_url, width: 1200, height: 630, alt: project.title }],
    } : undefined,
  }
}

function getDateLabel(project: Project): string {
  if (!project.start_date && !project.end_date) return ''
  if (!project.end_date) return `Started ${project.start_date}`
  if (!project.start_date) return project.end_date
  return `${project.start_date} — ${project.end_date}`
}

function parseSections(description: string) {
  const lines = description.split('\n')
  const sections: { heading?: string; body: string[] }[] = []
  let current: { heading?: string; body: string[] } = { body: [] }

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)/)
    if (headingMatch) {
      if (current.body.length > 0 || current.heading) {
        sections.push(current)
      }
      current = { heading: headingMatch[1], body: [] }
    } else if (line.trim()) {
      current.body.push(line)
    }
  }
  if (current.body.length > 0 || current.heading) {
    sections.push(current)
  }
  return sections
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const project = await api.getProject(id) as Project

  const sections = project.description ? parseSections(project.description) : []

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <Link
        href="/projects"
        className="group mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </Link>

      {project.image_url && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl border border-border">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      )}

      <div className="border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {project.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.short_description && (
          <p className="mt-4 text-lg text-muted-foreground">{project.short_description}</p>
        )}

        {getDateLabel(project) && (
          <p className="mt-4 text-sm text-muted-foreground">{getDateLabel(project)}</p>
        )}
      </div>

      {sections.length > 0 ? (
        <div className="mt-8 space-y-10">
          {sections.map((section, idx) => (
            <section key={idx}>
              {section.heading && (
                <h2 className="mb-4 text-2xl font-bold text-foreground">{section.heading}</h2>
              )}
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                {section.body.map((paragraph, pi) => (
                  <p key={pi}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : project.description ? (
        <div className="mt-8 leading-relaxed text-muted-foreground">
          {project.description.split('\n').map((paragraph, idx) => (
            paragraph.trim() ? (
              <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
            ) : null
          ))}
        </div>
      ) : null}

      {(project.project_url || project.github_url) && (
        <div className="mt-10 flex flex-wrap gap-4 border-t border-border pt-8">
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
      )}
    </main>
  )
}
