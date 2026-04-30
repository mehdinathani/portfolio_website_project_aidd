'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface KnowledgeBaseEntry {
  id: string
  content: string
  source: string
  metadata: Record<string, unknown>
  created_at: string
}

const SOURCE_OPTIONS = ['manual', 'website', 'document', 'chat']

export default function AdminKnowledgeBasePage() {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<KnowledgeBaseEntry | null>(null)

  const [form, setForm] = useState({
    content: '',
    source: 'manual',
    metadata: '{}',
  })

  async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: sessionData } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionData.session?.access_token}`,
    }
  }

  async function fetchEntries() {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${API_BASE}/api/v1/admin/knowledge-base`, { headers })
      if (res.ok) {
        setEntries(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch knowledge base entries:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  function resetForm() {
    setForm({ content: '', source: 'manual', metadata: '{}' })
    setEditing(null)
    setShowForm(false)
  }

  function openAdd() {
    resetForm()
    setShowForm(true)
  }

  function openEdit(entry: KnowledgeBaseEntry) {
    setForm({
      content: entry.content,
      source: entry.source,
      metadata: JSON.stringify(entry.metadata, null, 2),
    })
    setEditing(entry)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    let parsedMetadata: Record<string, unknown>
    try {
      parsedMetadata = JSON.parse(form.metadata || '{}')
    } catch {
      alert('Metadata must be valid JSON')
      return
    }

    const headers = await getAuthHeaders()
    const payload = {
      content: form.content,
      source: form.source,
      metadata: parsedMetadata,
    }

    const url = editing
      ? `${API_BASE}/api/v1/admin/knowledge-base/${editing.id}`
      : `${API_BASE}/api/v1/admin/knowledge-base`
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, { method, headers, body: JSON.stringify(payload) })
    if (res.ok) {
      resetForm()
      fetchEntries()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this knowledge base entry?')) return
    const headers = await getAuthHeaders()
    await fetch(`${API_BASE}/api/v1/admin/knowledge-base/${id}`, { method: 'DELETE', headers })
    fetchEntries()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <button onClick={openAdd} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Add Entry
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold">{editing ? 'Edit Entry' : 'New Entry'}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows={5}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Enter knowledge base content..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Source</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Metadata (JSON)
            </label>
            <textarea
              value={form.metadata}
              onChange={(e) => setForm({ ...form, metadata: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono"
              placeholder='{"key": "value"}'
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
              {editing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-3 py-2">Content Preview</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="max-w-md px-3 py-2">
                    <p className="truncate text-sm">
                      {entry.content.length > 100
                        ? entry.content.slice(0, 100) + '...'
                        : entry.content}
                    </p>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">
                      {entry.source}
                    </span>
                  </td>
                  <td className="px-3 py-2">{entry.created_at ? entry.created_at.slice(0, 10) : ''}</td>
                  <td className="px-3 py-2 space-x-2">
                    <button onClick={() => openEdit(entry)} className="text-sm text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="text-sm text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                    No knowledge base entries yet.
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
