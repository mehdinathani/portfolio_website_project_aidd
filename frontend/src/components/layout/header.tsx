'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/#process', label: 'Process' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          className="logo-wordmark type-title font-semibold tracking-tight transition hover:opacity-80"
        >
          Mehdi Nathani
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="type-caption text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-white sm:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex flex-col gap-4 overflow-hidden bg-black/90 px-6 py-4 backdrop-blur-sm sm:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="type-caption text-muted transition-colors hover:text-accent"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}