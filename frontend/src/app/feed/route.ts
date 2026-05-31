import { api } from '@/lib/api'
import type { Project } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mehdinathani.com'
  let projects: Project[] = []

  try {
    projects = (await api.getProjects()) as Project[]
  } catch {}

  const items = projects.map(
    (p) => `
    <entry>
      <title>${escapeXml(p.title)}</title>
      <link href="${baseUrl}/projects/${p.id}" />
      <id>${baseUrl}/projects/${p.id}</id>
      <updated>${new Date(p.created_at).toISOString()}</updated>
      <summary>${escapeXml(p.short_description || '')}</summary>
    </entry>`,
  )

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Mehdi Abbas Nathani — Projects</title>
  <link href="${baseUrl}/feed" rel="self" />
  <link href="${baseUrl}" />
  <updated>${new Date().toISOString()}</updated>
  <id>${baseUrl}/</id>
  <author>
    <name>Mehdi Abbas Nathani</name>
  </author>
  <subtitle>Latest projects by Mehdi Abbas Nathani</subtitle>
  ${items.join('')}
</feed>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=600',
    },
  })
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
