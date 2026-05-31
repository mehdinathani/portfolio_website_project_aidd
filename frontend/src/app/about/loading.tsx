export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="h-40 w-40 animate-pulse rounded-2xl bg-secondary" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-64 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-48 animate-pulse rounded bg-secondary" />
          <div className="h-20 w-full animate-pulse rounded bg-secondary" />
        </div>
      </div>
      <div className="mt-20 space-y-6">
        <div className="h-6 w-48 animate-pulse rounded bg-secondary" />
        <div className="h-4 w-full animate-pulse rounded bg-secondary" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  )
}
