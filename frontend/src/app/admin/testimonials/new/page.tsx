'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'

export default function NewTestimonialPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    author_name: '',
    author_role: '',
    author_company: '',
    quote: '',
    linkedin_url: '',
    date: '',
    order_index: 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await apiAdmin.createTestimonial({
        ...form,
        order_index: Number(form.order_index),
      })
      router.push('/admin/testimonials')
    } catch (e: any) {
      setError(e.message || 'Failed to create testimonial')
    } finally {
      setSaving(false)
    }
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
        <h1 className="text-2xl font-bold text-black">New Testimonial</h1>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/70">Author Name</label>
            <input
              type="text"
              required
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">Author Role</label>
            <input
              type="text"
              value={form.author_role}
              onChange={(e) => setForm({ ...form, author_role: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/70">Author Company</label>
            <input
              type="text"
              value={form.author_company}
              onChange={(e) => setForm({ ...form, author_company: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">Quote</label>
          <textarea
            rows={4}
            required
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">LinkedIn URL</label>
          <input
            type="url"
            value={form.linkedin_url}
            onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">Display Order</label>
          <input
            type="number"
            value={form.order_index}
            onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-black transition-colors hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Testimonial'}
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
