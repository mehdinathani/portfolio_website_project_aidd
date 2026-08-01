'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'

export default function EditKBEntryPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [form, setForm] = useState<{ content: string; source: string; metadata: string }>({
    content: '',
    source: '',
    metadata: '{}',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    apiAdmin.getKnowledgeBase().then((items: any[]) => {
      const item = items.find((k: any) => k.id === id)
      if (item) {
        setForm({
          content: item.content || '',
          source: item.source || '',
          metadata: item.metadata ? JSON.stringify(item.metadata, null, 2) : '{}',
        })
      }
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      let parsedMetadata = {}
      try {
        parsedMetadata = JSON.parse(form.metadata)
      } catch {
        setError('Invalid JSON in metadata field')
        setSaving(false)
        return
      }
      await apiAdmin.updateKBEntry(id, {
        content: form.content,
        source: form.source,
        metadata: parsedMetadata,
      })
      router.push('/admin/knowledge-base')
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this knowledge base entry? The embedding will also be removed.')) return
    setDeleting(true)
    try {
      await apiAdmin.deleteKBEntry(id)
      router.push('/admin/knowledge-base')
    } catch (e: any) {
      setError(e.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>
  }

  return (
    <div>
      <Link
        href="/admin/knowledge-base"
        className="mb-6 inline-block text-sm text-blue-600 transition-colors hover:text-blue-700"
      >
        &larr; Back to Knowledge Base
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Edit Knowledge Base Entry</h1>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Source</label>
          <input
            type="text"
            value={form.source || ''}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="e.g., resume, project_description, bio"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            rows={8}
            required
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Enter the knowledge base content chunk..."
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This content will be embedded using Gemini text-embedding-004 when saved.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Metadata (JSON)</label>
          <textarea
            rows={4}
            value={form.metadata}
            onChange={(e) => setForm({ ...form, metadata: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Re-embed'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-300 px-6 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <Link
            href="/admin/knowledge-base"
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
