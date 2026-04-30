'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type LeadStatus = 'new' | 'reviewed' | 'replied' | 'archived'

interface Lead {
  id: string
  name: string
  email: string
  category: string
  status: LeadStatus
  created_at: string
}

const STATUS_OPTIONS: LeadStatus[] = ['new', 'reviewed', 'replied', 'archived']
const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-700',
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState<LeadStatus | ''>('')

  async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: sessionData } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionData.session?.access_token}`,
    }
  }

  async function fetchLeads() {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${API_BASE}/api/v1/admin/leads`, { headers })
      if (res.ok) {
        setLeads(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  async function updateStatus(id: string, newStatus: LeadStatus) {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_BASE}/api/v1/admin/leads/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      fetchLeads()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lead?')) return
    const headers = await getAuthHeaders()
    await fetch(`${API_BASE}/api/v1/admin/leads/${id}`, { method: 'DELETE', headers })
    fetchLeads()
  }

  const categories = [...new Set(leads.map((l) => l.category))]

  const filteredLeads = leads.filter((l) => {
    if (filterCategory && l.category !== filterCategory) return false
    if (filterStatus && l.status !== filterStatus) return false
    return true
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Leads Management</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as LeadStatus | '')}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button
          onClick={() => { setFilterCategory(''); setFilterStatus('') }}
          className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{lead.name}</td>
                  <td className="px-3 py-2">{lead.email}</td>
                  <td className="px-3 py-2">{lead.category}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{lead.created_at ? lead.created_at.slice(0, 10) : ''}</td>
                  <td className="px-3 py-2 space-x-2">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
