'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { Search, MessageSquare, Mail, ExternalLink } from 'lucide-react'

const actions = [
  { id: 'home', label: 'Home', shortcut: 'G H', perform: (router: ReturnType<typeof useRouter>) => router.push('/') },
  { id: 'projects', label: 'Projects', shortcut: 'G P', perform: (router: ReturnType<typeof useRouter>) => router.push('/projects') },
  { id: 'about', label: 'About', shortcut: 'G A', perform: (router: ReturnType<typeof useRouter>) => router.push('/about') },
  { id: 'contact', label: 'Contact', shortcut: 'G C', perform: (router: ReturnType<typeof useRouter>) => router.push('/contact') },
  { id: 'chat', label: 'Open Chat', shortcut: 'C', perform: () => {
    const event = new CustomEvent('open-chat')
    document.dispatchEvent(event)
  }},
  { id: 'copy-email', label: 'Copy Email', shortcut: 'E', perform: async () => {
    try {
      await navigator.clipboard.writeText('mehdi@example.com')
    } catch { /* ignore */ }
  }},
  { id: 'book-call', label: 'Book a Call', shortcut: 'B', perform: () => {
    window.open('https://cal.com/mehdinathani', '_blank', 'noopener')
  }},
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-start justify-center pt-[20vh] bg-black/50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="overflow-hidden rounded-lg">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Command.Input
              placeholder="Search or jump..."
              className="flex h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-64 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            {actions.map((action) => (
              <Command.Item
                key={action.id}
                value={action.label}
                onSelect={() => {
                  action.perform(router)
                  setOpen(false)
                }}
                className="flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 text-sm text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                {action.id === 'chat' && <MessageSquare className="h-4 w-4" />}
                {action.id === 'copy-email' && <Mail className="h-4 w-4" />}
                {action.id === 'book-call' && <ExternalLink className="h-4 w-4" />}
                {!['chat', 'copy-email', 'book-call'].includes(action.id) && (
                  <span className="h-4 w-4" />
                )}
                {action.label}
                {action.shortcut && (
                  <kbd className="ml-auto text-[10px] text-muted-foreground">
                    {action.shortcut}
                  </kbd>
                )}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
