export default function CertificationsLoading() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 h-10 w-48 animate-pulse rounded bg-secondary mx-auto" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      </div>
    </div>
  )
}
