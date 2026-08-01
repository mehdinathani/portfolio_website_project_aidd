import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Uses',
  description: 'Tools, software, and gear that Mehdi Abbas Nathani uses daily.',
}

const categories = [
  {
    title: 'Editor & Terminal',
    items: [
      { name: 'Neovim', description: 'Primary editor — custom config with LSP, telescope, and harpoon.' },
      { name: 'Kitty', description: 'GPU-accelerated terminal emulator.' },
      { name: 'tmux', description: 'Session management and multiplexing.' },
      { name: 'zsh + starship', description: 'Shell with fast prompt and git integration.' },
    ],
  },
  {
    title: 'Languages & Frameworks',
    items: [
      { name: 'TypeScript', description: 'Main language for full-stack and AI app development.' },
      { name: 'Python', description: 'AI/ML prototyping, backend services, data pipelines.' },
      { name: 'Next.js', description: 'React framework for production web applications.' },
      { name: 'FastAPI', description: 'Python backend framework for API services.' },
    ],
  },
  {
    title: 'AI & ML Tools',
    items: [
      { name: 'Claude / ChatGPT', description: 'AI assistants for coding, research, and ideation.' },
      { name: 'LangChain / LlamaIndex', description: 'Agentic frameworks for building LLM applications.' },
      { name: 'Hugging Face', description: 'Model hub and inference for open-source models.' },
    ],
  },
]

export default function UsesPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">Uses</h1>
      <p className="mt-2 text-muted-foreground">
        Tools, software, and gear I use daily.
      </p>

      <div className="mt-10 space-y-10">
        {categories.map((cat) => (
          <section key={cat.title}>
            <h2 className="text-xl font-semibold text-foreground">{cat.title}</h2>
            <ul className="mt-4 space-y-4">
              {cat.items.map((item) => (
                <li key={item.name}>
                  <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-16 text-xs text-muted-foreground">
        Inspired by{' '}
        <a
          href="https://uses.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4"
        >
          /uses page movement
        </a>
        .
      </p>
    </main>
  )
}
