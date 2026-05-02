'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminTable from '@/components/admin/AdminTable'
import { apiAdmin } from '@/lib/api-admin'
import type { Certification } from '@/types/api'

export const dynamic = 'force-dynamic'

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Certification | null>(null)

  const [form, setForm] = useState({
    name: '', issuer: '', date_earned: '', credential_url: '', order_index: 0,
  })

  async function fetchCertifications() {
    setLoading(true)
    try {
      const data = await apiAdmin.getCertifications()
      setCertifications(data as Certification[])
    } catch (err) {
      console.error('Failed to fetch certifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCertifications() }, [])

  function resetForm() {
    setForm({ name: '', issuer: '', date_earned: '', credential_url: '', order_index: 0 })
    setEditing(null)
    setShowForm(false)
  }

  function openEdit(cert: Certification) {
    setForm({
      name: cert.name, issuer: cert.issuer,
      date_earned: cert.date_earned ? cert.date_earned.slice(0, 10) : '',
      credential_url: cert.credential_url || '', order_index: cert.order_index,
    })
    setEditing(cert)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...form, date_earned: form.date_earned, order_index: Number(form.order_index) }
    if (editing) {
      await apiAdmin.updateCertification(editing.id, payload)
    } else {
      await apiAdmin.createCertification(payload)
    }
    resetForm()
    fetchCertifications()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this certification?')) return
    await apiAdmin.deleteCertification(id)
    fetchCertifications()
  }

  const columns = [
    { key: 'name', title: 'Name', render: (c: Certification) => <Link href={`/admin/certifications/${c.id}`} className="text-blue-600 hover:underline">{c.name}</Link> },
    { key: 'issuer', title: 'Issuer', render: (c: Certification) => c.issuer },
    { key: 'date', title: 'Date Earned', render: (c: Certification) => c.date_earned ? c.date_earned.slice(0, 10) : '' },
    { key: 'order', title: 'Order', render: (c: Certification) => c.order_index },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
        <Link
          href="/admin/certifications/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700 inline-block"
        >
          Add Certification
        </Link>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Certification' : 'New Certification'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Issuer</label>
              <input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date Earned</label>
              <input type="date" value={form.date_earned} onChange={(e) => setForm({ ...form, date_earned: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Credential URL</label>
              <input type="url" value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              {editing ? 'Save Changes' : 'Create Certification'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <AdminTable
          columns={columns}
          data={certifications}
          getKey={(c) => c.id}
          onEdit={(c) => openEdit(c)}
          onDelete={(c) => handleDelete(c.id)}
          emptyMessage="No certifications yet. Click 'Add Certification' to create one."
        />
      )}
    </div>
  )
}
