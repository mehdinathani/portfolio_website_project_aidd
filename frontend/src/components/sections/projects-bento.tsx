'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
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
                className="group relative flex h-full flex-col justify-end overflow-hidden rounded-xl border border-border bg-secondary p-6 transition-colors hover:border-primary/30"
              >
                {featured.image_url && (
                  <motion.div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <Image
                      src={featured.image_url}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/10" />
                  </motion.div>
                )}
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-xl bg-primary/5"
                />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-foreground">{featured.title}</h3>
                  <p className="relative mt-2 text-sm text-muted-foreground line-clamp-2">
                    {featured.short_description}
                  </p>
                  <div className="relative mt-3 flex flex-wrap gap-1.5">
                    {featured.tech_stack.slice(0, 3).map((tech) => (
                      <span key={tech} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </TiltCard>
          )}
          {visibleOthers.map((project) => (
            <TiltCard key={project.id} maxTilt={3} scale={1.01}>
              <Link
                href={`/projects/${project.id}`}
                className="group relative flex h-full flex-col justify-end overflow-hidden rounded-xl border border-border bg-secondary p-5 transition-colors hover:border-primary/30"
              >
                {project.image_url && (
                  <motion.div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/10" />
                  </motion.div>
                )}
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-xl bg-primary/5"
                />
                <div className="relative z-10">
                  <h3 className="text-base font-semibold text-foreground">{project.title}</h3>
                  <p className="relative mt-1 text-xs text-muted-foreground line-clamp-2">
                    {project.short_description}
                  </p>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
