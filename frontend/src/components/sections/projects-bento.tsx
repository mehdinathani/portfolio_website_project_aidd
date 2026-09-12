'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
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

  const visibleOthers = others.slice(0, 4)

  return (
    <section className="px-6 pb-4 pt-8 md:pb-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-4 md:grid-cols-2">
          {visibleOthers.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors hover:border-white/[0.2]"
              >
                <p className="type-label mb-2 text-white/35">Shipped product</p>
                <h3 className="type-title text-white">{project.title}</h3>
                <p className="type-card-body mt-2 text-white/55 line-clamp-3">
                  {project.short_description}
                </p>
                {project.tech_stack.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {project.tech_stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-primary/40 px-2.5 py-1 text-[0.6875rem] font-medium tracking-tight text-white/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}