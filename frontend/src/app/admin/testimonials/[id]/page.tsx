'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'
import type { Testimonial } from '@/types/api'

export default function EditTestimonialPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [form, setForm] = useState<Partial<Testimonial>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    apiAdmin.getTestimonials().then((items: any[]) => {
      const item = items.find((t: any) => t.id === id)
      if (item) {
        setForm({
          author_name: item.author_name || '',
          author_role: item.author_role || '',
          author_company: item.author_company || '',
          quote: item.quote || '',
          date: item.date || '',
          linkedin_url: item.linkedin_url || '',
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
      await apiAdmin.updateTestimonial(id, form)
      router.push('/admin/testimonials')
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this testimonial?')) return
    setDeleting(true)
    try {
      await apiAdmin.deleteTestimonial(id)
      router.push('/admin/testimonials')
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
        href="/admin/testimonials"
        className="mb-6 inline-block text-sm text-accent transition-colors hover:text-accent"
      >
        &larr; Back to Testimonials
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-black">Edit Testimonial</h1>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/70">Author Name</label>
          <input
            type="text"
            required
            value={form.author_name || ''}
            onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/70">Role</label>
            <input
              type="text"
              value={form.author_role || ''}
              onChange={(e) => setForm({ ...form, author_role: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">Company</label>
            <input
              type="text"
              value={form.author_company || ''}
              onChange={(e) => setForm({ ...form, author_company: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">Quote</label>
          <textarea
            rows={4}
            required
            value={form.quote || ''}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/70">Date</label>
            <input
              type="date"
              value={form.date || ''}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
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

        <div>
          <label className="block text-sm font-medium text-white/70">LinkedIn URL</label>
          <input
            type="url"
            value={form.linkedin_url || ''}
            onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
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
            href="/admin/testimonials"
            className="rounded-lg border border-white/10 px-6 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.02]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
