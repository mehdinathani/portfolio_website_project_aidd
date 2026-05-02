'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'

const SOURCES = ['resume', 'project', 'bio', 'certification', 'testimonial', 'other']

export default function NewKBEntryPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    content: '',
    source: 'resume',
    metadata: '{}',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    let parsedMetadata = {}
    try {
      parsedMetadata = JSON.parse(form.metadata)
    } catch {
      setError('Metadata must be valid JSON')
      setSaving(false)
      return
    }

    try {
      await apiAdmin.createKBEntry({
        content: form.content,
        source: form.source,
        metadata: parsedMetadata,
      })
      router.push('/admin/knowledge-base')
    } catch (e: any) {
      setError(e.message || 'Failed to create KB entry')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/knowledge-base"
        className="mb-6 inline-block text-sm text-blue-600 transition-colors hover:text-blue-700"
      >
        &larr; Back to Knowledge Base
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900">New Knowledge Base Entry</h1>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            rows={8}
            required
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter the knowledge base content that the AI should use to answer questions..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Source Type</label>
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Metadata (JSON)
          </label>
          <textarea
            rows={4}
            value={form.metadata}
            onChange={(e) => setForm({ ...form, metadata: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder='{"key": "value"}'
          />
        </div>

        <p className="text-xs text-gray-500">
          Note: The embedding will be automatically generated when you save this entry.
        </p>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Entry'}
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
