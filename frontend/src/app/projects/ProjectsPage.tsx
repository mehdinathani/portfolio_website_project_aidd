'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import TiltCard from '@/components/motion/tilt-card'
import type { Project } from '@/types/api'

export default function ProjectsPage({ projects: allProjects }: { projects: Project[] }) {
  const [search, setSearch] = useState('')
  const [activeTech, setActiveTech] = useState<string | null>(null)

  const allTechs = useMemo(() => {
    const techs = new Set<string>()
    allProjects.forEach((p) => p.tech_stack.forEach((t) => techs.add(t)))
    return Array.from(techs).sort()
  }, [allProjects])

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.short_description.toLowerCase().includes(search.toLowerCase())) return false
      if (activeTech && !p.tech_stack.includes(activeTech)) return false
      return true
    })
  }, [allProjects, search, activeTech])

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-foreground">Projects</h1>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTech(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !activeTech ? 'bg-primary text-primary-foreground' : 'border border-border bg-secondary text-muted-foreground hover:border-primary/50'
              }`}
            >
              All
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setActiveTech(activeTech === tech ? null : tech)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTech === tech ? 'bg-primary text-primary-foreground' : 'border border-border bg-secondary text-muted-foreground hover:border-primary/50'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No projects found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <TiltCard key={project.id} maxTilt={3} scale={1.01}>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex h-full flex-col justify-end rounded-xl border border-border bg-secondary p-6 transition-colors hover:border-primary/30"
                >
                  <h2 className="text-lg font-bold text-foreground">{project.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {project.short_description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
