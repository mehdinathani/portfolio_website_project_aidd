export default function ProjectsLoading() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 h-10 w-48 animate-pulse rounded bg-secondary" />
        <div className="mb-8 h-10 w-full animate-pulse rounded-lg bg-secondary" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      </div>
    </div>
  )
}
