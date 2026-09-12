import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Now',
  description: 'What Mehdi Abbas Nathani is focused on right now — inspired by the /now page movement.',
}

export default function NowPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">Now</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated — May 2026
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-foreground">
            🚀 Building Agentic AI products
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Shipping production-grade AI applications — from conversational agents to
            intelligent automation pipelines. Focused on bridging the gap between
            cutting-edge AI research and real-world product needs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            📖 Deepening systems thinking
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Studying distributed systems, system design, and software architecture
            patterns. Reading about AI safety, agentic frameworks, and MLOps best practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            🏃 Staying active
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Running 3x a week, experimenting with calisthenics, and maintaining a
            consistent morning routine for focused deep work.
          </p>
        </section>

        <p className="text-xs text-muted-foreground">
          Inspired by{' '}
          <a
            href="https://nownownow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            /now page movement
          </a>
          .
        </p>
      </div>
    </main>
  )
}
