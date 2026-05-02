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
        className="mb-6 inline-block text-sm text-blue-600 transition-colors hover:text-blue-700"
      >
        &larr; Back to Leads
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{lead.email}</p>
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
              className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Category</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{categoryLabel}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Source</p>
            <p className="mt-1 text-sm text-gray-900">{lead.source}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Date</p>
            <p className="mt-1 text-sm text-gray-900">{leadDate}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Message</p>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{lead.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
