'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Certification {
  id: string
  name: string
  issuer: string
  date_earned: string
  credential_url: string
  order_index: number
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Certification | null>(null)

  const [form, setForm] = useState({
    name: '',
    issuer: '',
    date_earned: '',
    credential_url: '',
    order_index: 0,
  })

  async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: sessionData } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionData.session?.access_token}`,
    }
  }

  async function fetchCertifications() {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${API_BASE}/api/v1/certifications`, { headers })
      if (res.ok) {
        setCertifications(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch certifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertifications()
  }, [])

  function resetForm() {
    setForm({ name: '', issuer: '', date_earned: '', credential_url: '', order_index: 0 })
    setEditing(null)
    setShowForm(false)
  }

  function openAdd() {
    resetForm()
    setShowForm(true)
  }

  function openEdit(cert: Certification) {
    setForm({
      name: cert.name,
      issuer: cert.issuer,
      date_earned: cert.date_earned ? cert.date_earned.slice(0, 10) : '',
      credential_url: cert.credential_url,
      order_index: cert.order_index,
    })
    setEditing(cert)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const headers = await getAuthHeaders()
    const payload = { ...form, date_earned: form.date_earned, order_index: Number(form.order_index) }

    const url = editing
      ? `${API_BASE}/api/v1/certifications/${editing.id}`
      : `${API_BASE}/api/v1/certifications`
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, { method, headers, body: JSON.stringify(payload) })
    if (res.ok) {
      resetForm()
      fetchCertifications()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this certification?')) return
    const headers = await getAuthHeaders()
    await fetch(`${API_BASE}/api/v1/certifications/${id}`, { method: 'DELETE', headers })
    fetchCertifications()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
        <button onClick={openAdd} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Add Certification
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold">{editing ? 'Edit Certification' : 'New Certification'}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Issuer</label>
              <input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Credential URL</label>
              <input type="url" value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order Index</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
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
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Issuer</th>
                <th className="px-3 py-2">Date Earned</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{c.name}</td>
                  <td className="px-3 py-2">{c.issuer}</td>
                  <td className="px-3 py-2">{c.date_earned ? c.date_earned.slice(0, 10) : ''}</td>
                  <td className="px-3 py-2">{c.order_index}</td>
                  <td className="px-3 py-2 space-x-2">
                    <button onClick={() => openEdit(c)} className="text-sm text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {certifications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-gray-500">No certifications yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
