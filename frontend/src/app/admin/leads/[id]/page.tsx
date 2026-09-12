import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/admin/StatusBadge'
import { apiAdmin } from '@/lib/api-admin'
import type { Lead } from '@/types/api'

const CATEGORIES: Record<string, string> = {
  job_offer: 'Job Offer',
  freelance: 'Freelance',
  collaboration: 'Collaboration',
  chatbot_capture: 'Chatbot Capture',
  other: 'Other',
}

export const revalidate = 0

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Fetch lead on the server
  const leads = (await apiAdmin.getLeads()) as Lead[]
  const lead = leads.find((l) => l.id === id)

  if (!lead) notFound()

  const categoryLabel = CATEGORIES[lead.category] || lead.category
  const leadDate = new Date(lead.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  async function updateStatus(formData: FormData) {
    'use server'
    const newStatus = formData.get('status') as string
    await apiAdmin.updateLeadStatus(id, newStatus)
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/leads"
        className="mb-6 inline-block text-sm text-accent transition-colors hover:text-accent"
      >
        &larr; Back to Leads
      </Link>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">{lead.name}</h1>
            <p className="mt-1 text-sm text-white/40">{lead.email}</p>
          </div>
          <form action={updateStatus}>
            <StatusBadge status={lead.status} onChange={(s) => {}} />
            <select
              name="status"
              defaultValue={lead.status}
              onChange={(e) => {
                const form = new FormData()
                form.append('status', e.target.value)
                updateStatus(form)
              }}
              className="ml-2 rounded border border-white/10 px-2 py-1 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </form>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">Category</p>
            <p className="mt-1 text-sm font-medium text-black">{categoryLabel}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">Source</p>
            <p className="mt-1 text-sm text-black">{lead.source}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">Date</p>
            <p className="mt-1 text-sm text-black">{leadDate}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Message</p>
          <div className="rounded-lg bg-white/[0.02] p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">{lead.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
