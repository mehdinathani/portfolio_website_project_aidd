import { api } from '@/lib/api'
import type { Certification } from '@/types/api'

export const dynamic = 'force-dynamic'

export const revalidate = 60

export default async function CertificationsPage() {
  const certifications = await api.getCertifications() as Certification[]

  const sorted = [...certifications].sort((a, b) => a.order_index - b.order_index)

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-10 text-center text-3xl font-bold text-gray-900">Certifications</h1>

      {sorted.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No certifications found.</p>
      ) : (
        <div className="space-y-6">
          {sorted.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-base font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-sm text-blue-600">{cert.issuer}</p>
                <p className="mt-1 text-sm text-gray-500">{cert.date_earned}</p>
              </div>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  View Credential &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
