'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { Search, MessageSquare, Mail, ExternalLink, FileText, Code } from 'lucide-react'
import FocusTrap from 'focus-trap-react'
import { api } from '@/lib/api'
import type { Project, Skill } from '@/types/api'

interface SearchResult {
  id: string
  label: string
  description?: string
  type: 'project' | 'skill' | 'action'
  perform: (router: ReturnType<typeof useRouter>) => void
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    Promise.all([
      api.getProjects() as Promise<Project[]>,
      api.getSkills() as Promise<Skill[]>,
    ])
      .then(([proj, skl]) => {
        setProjects(proj)
        setSkills(skl)
      })
      .catch(() => {})
  }, [open])

  const toggle = useCallback(() => setOpen((prev) => !prev), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [open])

  const actions: SearchResult[] = [
    { id: 'home', label: 'Home', type: 'action', perform: (r) => r.push('/') },
    { id: 'projects', label: 'Projects', type: 'action', perform: (r) => r.push('/projects') },
    { id: 'about', label: 'About', type: 'action', perform: (r) => r.push('/about') },
    { id: 'now', label: 'Now', type: 'action', perform: (r) => r.push('/now') },
    { id: 'uses', label: 'Uses', type: 'action', perform: (r) => r.push('/uses') },
    { id: 'contact', label: 'Contact', type: 'action', perform: (r) => r.push('/contact') },
    { id: 'chat', label: 'Open Chat', type: 'action', perform: () => {
      const event = new CustomEvent('open-chat')
      document.dispatchEvent(event)
    }},
    { id: 'copy-email', label: 'Copy Email', type: 'action', perform: async () => {
      try {
        await navigator.clipboard.writeText(process.env.NEXT_PUBLIC_EMAIL || 'mehdi@example.com')
      } catch { /* ignore */ }
    }},
    { id: 'book-call', label: 'Book a Call', type: 'action', perform: () => {
      window.open(process.env.NEXT_PUBLIC_CAL_URL || 'https://cal.com/mehdinathani', '_blank', 'noopener')
    }},
  ]

  const projectResults: SearchResult[] = projects.map((p) => ({
    id: `project-${p.id}`,
    label: p.title,
    description: p.short_description,
    type: 'project' as const,
    perform: (r) => r.push(`/projects/${p.id}`),
  }))

  const skillResults: SearchResult[] = skills.map((s) => ({
    id: `skill-${s.id}`,
    label: s.name,
    description: s.category,
    type: 'skill' as const,
    perform: () => {},
  }))

  const allResults = [...actions, ...projectResults, ...skillResults]

  if (!open) return null

  return (
    <FocusTrap
      focusTrapOptions={{
        onDeactivate: () => {
          setOpen(false)
          setSearch('')
        },
        clickOutsideDeactivates: true,
      }}
    >
      <div
        className="fixed inset-0 z-[9998] flex items-start justify-center bg-black/50 pt-[20vh]"
        onClick={() => {
          setOpen(false)
          setSearch('')
        }}
      >
        <div
          className="w-full max-w-lg rounded-lg border border-border bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <Command className="overflow-hidden rounded-lg">
            <div className="flex items-center border-b border-border px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search pages, projects, skills..."
                className="flex h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Command.List className="max-h-72 overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group heading="Pages">
                {actions.map((action) => (
                  <Command.Item
                    key={action.id}
                    value={action.label}
                    onSelect={() => {
                      action.perform(router)
                      setOpen(false)
                      setSearch('')
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 text-sm text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  >
                    {action.id === 'chat' && <MessageSquare className="h-4 w-4" />}
                    {action.id === 'copy-email' && <Mail className="h-4 w-4" />}
                    {action.id === 'book-call' && <ExternalLink className="h-4 w-4" />}
                    {['home', 'projects', 'about', 'now', 'uses', 'contact'].includes(action.id) && (
                      <FileText className="h-4 w-4" />
                    )}
                    {action.label}
                  </Command.Item>
                ))}
              </Command.Group>

              {projectResults.length > 0 && search && (
                <Command.Group heading="Projects">
                  {projectResults.map((result) => (
                    <Command.Item
                      key={result.id}
                      value={result.label}
                      onSelect={() => {
                        result.perform(router)
                        setOpen(false)
                        setSearch('')
                      }}
                      className="flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 text-sm text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                    >
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span>{result.label}</span>
                        {result.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {result.description}
                          </span>
                        )}
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {skillResults.length > 0 && search && (
                <Command.Group heading="Skills">
                  {skillResults.map((result) => (
                    <Command.Item
                      key={result.id}
                      value={result.label}
                      onSelect={() => {
                        setOpen(false)
                        setSearch('')
                      }}
                      className="flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 text-sm text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                    >
                      <span className="h-4 w-4 rounded-full bg-primary/20" />
                      <div className="flex flex-col">
                        <span>{result.label}</span>
                        {result.description && (
                          <span className="text-xs text-muted-foreground">
                            {result.description}
                          </span>
                        )}
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>
          </Command>
        </div>
      </div>
    </FocusTrap>
  )
}
