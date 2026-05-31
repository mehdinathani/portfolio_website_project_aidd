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
        <h1 className="mt-6 text-6xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mt-3 text-muted-foreground">
          This page drifted into the digital void.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Contact
          </Link>
        </div>
      </div>
    </main>
  )
}
