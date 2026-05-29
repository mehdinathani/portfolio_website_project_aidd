'use client'

import Link from 'next/link'
import TiltCard from '@/components/motion/tilt-card'
import type { Project } from '@/types/api'

interface ProjectsBentoProps {
  projects: Project[]
  featuredId?: string
}

export default function ProjectsBento({ projects, featuredId }: ProjectsBentoProps) {
  const featured = featuredId
    ? projects.find((p) => p.id === featuredId)
    : projects[0]
  const others = projects.filter((p) => p.id !== featured?.id)

  const visibleOthers = others.slice(0, 5)

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
          Projects
        </h2>
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {featured && (
            <TiltCard className="md:col-span-2 md:row-span-2" maxTilt={3} scale={1.01}>
              <Link
                href={`/projects/${featured.id}`}
                className="flex h-full flex-col justify-end rounded-xl border border-border bg-secondary p-6 transition-colors hover:border-primary/30"
              >
                <h3 className="text-xl font-bold text-foreground">{featured.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {featured.short_description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {featured.tech_stack.slice(0, 3).map((tech) => (
                    <span key={tech} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            </TiltCard>
          )}
          {visibleOthers.map((project) => (
            <TiltCard key={project.id} maxTilt={3} scale={1.01}>
              <Link
                href={`/projects/${project.id}`}
                className="flex h-full flex-col justify-end rounded-xl border border-border bg-secondary p-5 transition-colors hover:border-primary/30"
              >
                <h3 className="text-base font-semibold text-foreground">{project.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {project.short_description}
                </p>
              </Link>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
