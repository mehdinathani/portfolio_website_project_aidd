'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Testimonial {
  id: string
  author_name: string
  author_role: string
  author_company: string
  quote: string
  date: string
  linkedin_url: string
  order_index: number
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)

  const [form, setForm] = useState({
    author_name: '',
    author_role: '',
    author_company: '',
    quote: '',
    date: '',
    linkedin_url: '',
    order_index: 0,
  })

  async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: sessionData } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionData.session?.access_token}`,
    }
  }

  async function fetchTestimonials() {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${API_BASE}/api/v1/testimonials`, { headers })
      if (res.ok) {
        setTestimonials(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  function resetForm() {
    setForm({ author_name: '', author_role: '', author_company: '', quote: '', date: '', linkedin_url: '', order_index: 0 })
    setEditing(null)
    setShowForm(false)
  }

  function openAdd() {
    resetForm()
    setShowForm(true)
  }

  function openEdit(t: Testimonial) {
    setForm({
      author_name: t.author_name,
      author_role: t.author_role,
      author_company: t.author_company,
      quote: t.quote,
      date: t.date ? t.date.slice(0, 10) : '',
      linkedin_url: t.linkedin_url,
      order_index: t.order_index,
    })
    setEditing(t)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const headers = await getAuthHeaders()
    const payload = { ...form, order_index: Number(form.order_index) }

    const url = editing
      ? `${API_BASE}/api/v1/testimonials/${editing.id}`
      : `${API_BASE}/api/v1/testimonials`
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, { method, headers, body: JSON.stringify(payload) })
    if (res.ok) {
      resetForm()
      fetchTestimonials()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    const headers = await getAuthHeaders()
    await fetch(`${API_BASE}/api/v1/testimonials/${id}`, { method: 'DELETE', headers })
    fetchTestimonials()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button onClick={openAdd} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Author Name</label>
              <input type="text" value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} required className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author Role</label>
              <input type="text" value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author Company</label>
              <input type="text" value={form.author_company} onChange={(e) => setForm({ ...form, author_company: e.target.value })} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
              <input type="url" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order Index</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quote</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={4} required className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
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
                <th className="px-3 py-2">Author</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{t.author_name}</td>
                  <td className="px-3 py-2">{t.author_role}</td>
                  <td className="px-3 py-2">{t.author_company}</td>
                  <td className="px-3 py-2">{t.date ? t.date.slice(0, 10) : ''}</td>
                  <td className="px-3 py-2">{t.order_index}</td>
                  <td className="px-3 py-2 space-x-2">
                    <button onClick={() => openEdit(t)} className="text-sm text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-gray-500">No testimonials yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
