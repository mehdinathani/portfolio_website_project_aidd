import { api } from '@/lib/api'
import type { Certification } from '@/types/api'
import { ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Certifications',
  description:
    'Professional certifications earned by Mehdi Abbas Nathani — AI, cloud, and software engineering credentials.',
}

export default async function CertificationsPage() {
  const certifications = await api.getCertifications() as Certification[]
  const sorted = [...certifications].sort((a, b) => a.order_index - b.order_index)

  return (
    <main className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="type-headline mb-12 text-center text-white">Certifications</h1>

        {sorted.length === 0 ? (
          <p className="py-16 text-center text-white/40">No certifications found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-white/[0.2]"
              >
                <h3 className="text-base font-semibold text-white">{cert.name}</h3>
                <p className="mt-1 text-sm text-accent">{cert.issuer}</p>
                <p className="mt-1 text-xs text-white/40">{cert.date_earned}</p>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white"
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
