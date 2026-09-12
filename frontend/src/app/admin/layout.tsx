'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Skills', href: '/admin/skills' },
  { label: 'Experience', href: '/admin/experience' },
  { label: 'Certifications', href: '/admin/certifications' },
  { label: 'Testimonials', href: '/admin/testimonials' },
  { label: 'Knowledge Base', href: '/admin/knowledge-base' },
  { label: 'Leads', href: '/admin/leads' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, signOut } = useAuth()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      setChecked(true)
    }
  }, [isLoading, isAuthenticated, pathname, router])

  if (!checked || (isLoading && pathname !== '/admin/login')) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white/40">Loading...</p>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-black text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.08] bg-white/[0.02] p-4">
        <h2 className="mb-6 text-lg font-bold text-black">Admin Panel</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-accent font-medium text-black'
                  : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="mt-4 w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-white/[0.01] p-8">{children}</main>
    </div>
  )
}
