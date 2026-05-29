'use client'

import Link from 'next/link'
import TiltCard from '@/components/motion/tilt-card'
import SharedLayout from '@/components/motion/shared-layout'
import type { Project } from '@/types/api'

interface FeaturedProjectProps {
  project: Project
}

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Featured Project
        </p>
        <TiltCard maxTilt={3} scale={1.01}>
          <SharedLayout layoutId={`project-${project.id}`}>
            <Link
              href={`/projects/${project.id}`}
              className="relative flex min-h-[75vh] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-secondary"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="relative z-10 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-foreground md:text-5xl">
                  {project.title}
                </h2>
                <p className="mt-3 max-w-xl text-lg text-muted-foreground">
                  {project.short_description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </SharedLayout>
        </TiltCard>
      </div>
    </section>
  )
}
