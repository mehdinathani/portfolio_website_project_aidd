import { api } from '@/lib/api'
import type { Project, Certification } from '@/types/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mehdinathani.com'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toUTCString()
}

export async function GET() {
  let projects: Project[] = []
  let certifications: Certification[] = []

  try {
    [projects, certifications] = await Promise.all([
      api.getProjects() as Promise<Project[]>,
      api.getCertifications() as Promise<Certification[]>,
    ])
  } catch {
  }

  const items: string[] = []

  for (const project of projects) {
    items.push(`    <item>
      <title>${escapeXml(project.title)}</title>
      <link>${SITE_URL}/projects/${project.id}</link>
      <description>${escapeXml(project.short_description || project.description?.slice(0, 300) || '')}</description>
      <pubDate>${project.created_at ? formatDate(project.created_at) : new Date().toUTCString()}</pubDate>
      <guid>${SITE_URL}/projects/${project.id}</guid>
      ${project.tech_stack.map(t => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`)
  }

  for (const cert of certifications) {
    items.push(`    <item>
      <title>${escapeXml(cert.name)} — ${escapeXml(cert.issuer)}</title>
      <link>${cert.credential_url || SITE_URL + '/certifications'}</link>
      <description>${escapeXml(`${cert.name} issued by ${cert.issuer}`)}</description>
      <pubDate>${cert.date_earned ? formatDate(cert.date_earned) : new Date().toUTCString()}</pubDate>
      <guid>${cert.id}</guid>
    </item>`)
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mehdi Abbas Nathani — Portfolio</title>
    <link>${SITE_URL}</link>
    <description>Projects, certifications, and updates from Mehdi Abbas Nathani</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
