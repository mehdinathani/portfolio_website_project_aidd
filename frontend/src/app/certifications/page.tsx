import { api } from '@/lib/api'
import type { Certification } from '@/types/api'
import { ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function CertificationsPage() {
  const certifications = await api.getCertifications() as Certification[]
  const sorted = [...certifications].sort((a, b) => a.order_index - b.order_index)

  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-12 text-center text-4xl font-bold text-foreground">Certifications</h1>

        {sorted.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No certifications found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col rounded-xl border border-border bg-secondary p-6 transition-colors hover:border-primary/30"
              >
                <h3 className="text-base font-semibold text-foreground">{cert.name}</h3>
                <p className="mt-1 text-sm text-primary">{cert.issuer}</p>
                <p className="mt-1 text-xs text-muted-foreground">{cert.date_earned}</p>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
