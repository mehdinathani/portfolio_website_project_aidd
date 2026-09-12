import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6">
      <div className="relative mx-auto max-w-md text-center">
        <svg
          className="mx-auto h-40 w-40 text-muted-foreground/10"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.3" strokeDasharray="4 4" />
          <path d="M100 45 L100 100 L140 120" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.3" />
        </svg>
        <h1 className="mt-6 text-6xl font-bold tracking-tight text-white">404</h1>
        <p className="mt-3 text-white/50">
          This page drifted into the digital void.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-black transition-all hover:brightness-110"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-white/[0.15] px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-white/[0.15] px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/[0.15] px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            Contact
          </Link>
        </div>
      </div>
    </main>
  )
}
