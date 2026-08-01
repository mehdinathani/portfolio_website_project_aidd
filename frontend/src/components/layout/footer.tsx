import Link from 'next/link'
import { ExternalLink, Mail } from 'lucide-react'

const SOCIAL_LINKS = {
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/mehdinathani',
  github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/mehdinathani',
  email: process.env.NEXT_PUBLIC_EMAIL || 'mehdi@example.com',
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Navigation</h3>
          <nav aria-label="Footer" className="flex flex-col gap-2.5">
            <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link>
            <Link href="/projects" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Projects</Link>
            <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Services</Link>
            <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About</Link>
            <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
          </nav>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Services</h3>
          <div className="flex flex-col gap-2.5">
            <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Web Development</Link>
            <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">AI / ML / GenAI</Link>
            <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">UI / UX Design</Link>
            <Link href="/services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Cloud Engineering</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Connect</h3>
          <div className="flex flex-col gap-2.5">
            <Link
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              LinkedIn
            </Link>
            <Link
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              GitHub
            </Link>
            <Link
              href={`mailto:${SOCIAL_LINKS.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Email
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Colophon</h3>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Tailwind, shadcn/ui &amp; Three.js
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            &copy; {year} Mehdi Abbas Nathani
          </p>
        </div>
      </div>
    </footer>
  )
}
