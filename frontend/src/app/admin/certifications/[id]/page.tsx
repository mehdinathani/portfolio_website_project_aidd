'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'
import type { Certification } from '@/types/api'

export default function EditCertificationPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [form, setForm] = useState<Partial<Certification>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    apiAdmin.getCertifications().then((items: any[]) => {
      const item = items.find((c: any) => c.id === id)
      if (item) {
        setForm({
          name: item.name || '',
          issuer: item.issuer || '',
          date_earned: item.date_earned || '',
          credential_url: item.credential_url || '',
          order_index: item.order_index || 0,
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
      await apiAdmin.updateCertification(id, form)
      router.push('/admin/certifications')
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this certification?')) return
    setDeleting(true)
    try {
      await apiAdmin.deleteCertification(id)
      router.push('/admin/certifications')
    } catch (e: any) {
      setError(e.message || 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-white/40">Loading...</div>
  }

  return (
    <div>
      <Link
        href="/admin/certifications"
        className="mb-6 inline-block text-sm text-accent transition-colors hover:text-accent"
      >
        &larr; Back to Certifications
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-black">Edit Certification</h1>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/70">Name</label>
          <input
            type="text"
            required
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">Issuer</label>
          <input
            type="text"
            required
            value={form.issuer || ''}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-white/70">Date Earned</label>
            <input
              type="date"
              value={form.date_earned || ''}
              onChange={(e) => setForm({ ...form, date_earned: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">Credential URL</label>
            <input
              type="url"
              value={form.credential_url || ''}
              onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">Order</label>
            <input
              type="number"
              value={form.order_index || 0}
              onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-black transition-colors hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-500/30 px-6 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <Link
            href="/admin/certifications"
            className="rounded-lg border border-white/10 px-6 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.02]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
