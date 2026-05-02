'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'

export default function NewCertificationPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    issuer: '',
    date_earned: '',
    credential_url: '',
    order_index: 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await apiAdmin.createCertification({
        ...form,
        order_index: Number(form.order_index),
      })
      router.push('/admin/certifications')
    } catch (e: any) {
      setError(e.message || 'Failed to create certification')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/certifications"
        className="mb-6 inline-block text-sm text-blue-600 transition-colors hover:text-blue-700"
      >
        &larr; Back to Certifications
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">New Certification</h1>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Issuer</label>
          <input
            type="text"
            required
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date Earned</label>
          <input
            type="date"
            value={form.date_earned}
            onChange={(e) => setForm({ ...form, date_earned: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Credential URL</label>
          <input
            type="url"
            value={form.credential_url}
            onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Display Order</label>
          <input
            type="number"
            value={form.order_index}
            onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Certification'}
          </button>
          <Link
            href="/admin/certifications"
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
