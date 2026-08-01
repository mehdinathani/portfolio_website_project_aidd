'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminTable from '@/components/admin/AdminTable'
import { apiAdmin } from '@/lib/api-admin'
import type { Testimonial } from '@/types/api'

export const dynamic = 'force-dynamic'

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)

  const [form, setForm] = useState({
    author_name: '', author_role: '', author_company: '', quote: '', date: '', linkedin_url: '', order_index: 0,
  })

  async function fetchTestimonials() {
    setLoading(true)
    try {
      const data = await apiAdmin.getTestimonials()
      setTestimonials(data as Testimonial[])
    } catch (err) {
      console.error('Failed to fetch testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTestimonials() }, [])

  function resetForm() {
    setForm({ author_name: '', author_role: '', author_company: '', quote: '', date: '', linkedin_url: '', order_index: 0 })
    setEditing(null)
    setShowForm(false)
  }

  function openEdit(t: Testimonial) {
    setForm({
      author_name: t.author_name, author_role: t.author_role, author_company: t.author_company || '',
      quote: t.quote, date: t.date ? t.date.slice(0, 10) : '',
      linkedin_url: t.linkedin_url || '', order_index: t.order_index,
    })
    setEditing(t)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...form, order_index: Number(form.order_index) }
    if (editing) {
      await apiAdmin.updateTestimonial(editing.id, payload)
    } else {
      await apiAdmin.createTestimonial(payload)
    }
    resetForm()
    fetchTestimonials()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    await apiAdmin.deleteTestimonial(id)
    fetchTestimonials()
  }

  const columns = [
    { key: 'author', title: 'Author', render: (t: Testimonial) => <Link href={`/admin/testimonials/${t.id}`} className="text-blue-600 hover:underline">{t.author_name}</Link> },
    { key: 'role', title: 'Role', render: (t: Testimonial) => t.author_role },
    { key: 'company', title: 'Company', render: (t: Testimonial) => t.author_company || '' },
    { key: 'date', title: 'Date', render: (t: Testimonial) => t.date ? t.date.slice(0, 10) : '' },
    { key: 'order', title: 'Order', render: (t: Testimonial) => t.order_index },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700 inline-block"
        >
          Add Testimonial
        </Link>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Author Name</label>
              <input type="text" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author Role</label>
              <input type="text" value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input type="text" value={form.author_company} onChange={(e) => setForm({ ...form, author_company: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
              <input type="url" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quote</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={4} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              {editing ? 'Save Changes' : 'Create Testimonial'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <AdminTable
          columns={columns}
          data={testimonials}
          getKey={(t) => t.id}
          onEdit={(t) => openEdit(t)}
          onDelete={(t) => handleDelete(t.id)}
          emptyMessage="No testimonials yet. Click 'Add Testimonial' to create one."
        />
      )}
    </div>
  )
}
