'use client'

import Link from 'next/link'
import AnimatedProjectBg from '@/components/sections/animated-project-bg'
import type { Project } from '@/types/api'

interface FeaturedProjectProps {
  project: Project
}

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  return (
    <section className="px-6">
      <Link
        href={`/projects/${project.id}`}
        className="group relative flex min-h-[60vh] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]"
      >
        <AnimatedProjectBg imageUrl={project.image_url} />
        {project.image_url && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        )}
        <div className="relative z-10 p-8 md:p-12">
          <p className="type-label mb-3 text-white/35">
            Featured · Shipped product
          </p>
          <h2 className="type-card-title text-white">{project.title}</h2>
          <p className="type-card-lead mt-3 max-w-xl text-white/65">
            {project.short_description}
          </p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.tech_stack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-primary/40 px-2.5 py-1 text-[0.6875rem] font-medium tracking-tight text-white/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </section>
  )
}