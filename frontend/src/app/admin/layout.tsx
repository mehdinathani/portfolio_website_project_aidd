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
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4">
        <h2 className="mb-6 text-lg font-bold text-gray-900">Admin Panel</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded px-3 py-2 text-sm ${
                pathname === item.href
                  ? 'bg-blue-100 font-medium text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="mt-4 w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
