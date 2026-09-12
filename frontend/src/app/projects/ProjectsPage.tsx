'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
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
      if (search) {
        const q = search.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchShort = p.short_description?.toLowerCase().includes(q)
        const matchLong = p.description?.toLowerCase().includes(q)
        const matchTech = p.tech_stack.some(t => t.toLowerCase().includes(q))
        if (!matchTitle && !matchShort && !matchLong && !matchTech) return false
      }
      if (activeTech && !p.tech_stack.includes(activeTech)) return false
      return true
    })
  }, [allProjects, search, activeTech])

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="type-label mb-4 text-accent/80">Selected work</p>
          <h1 className="type-headline text-white">Projects</h1>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-full border border-white/[0.1] bg-white/[0.03] px-5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTech(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !activeTech ? 'bg-accent text-black' : 'border border-white/[0.15] bg-white/[0.03] text-white/50 hover:border-accent/50'
              }`}
            >
              All
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setActiveTech(activeTech === tech ? null : tech)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTech === tech ? 'bg-accent text-black' : 'border border-white/[0.15] bg-white/[0.03] text-white/50 hover:border-accent/50'
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
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex h-full flex-col justify-end rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors hover:border-white/[0.2]"
              >
                <h2 className="text-lg font-semibold text-foreground">{project.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {project.short_description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech_stack.map((tech) => (
                    <span key={tech} className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] text-white/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
