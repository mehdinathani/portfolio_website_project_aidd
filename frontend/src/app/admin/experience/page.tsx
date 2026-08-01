'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminTable from '@/components/admin/AdminTable'
import { apiAdmin } from '@/lib/api-admin'
import type { Experience } from '@/types/api'

export const dynamic = 'force-dynamic'

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)

  const [form, setForm] = useState({
    company: '', role: '', start_date: '', end_date: '', responsibilities: '', order_index: 0,
  })

  async function fetchExperiences() {
    setLoading(true)
    try {
      const data = await apiAdmin.getExperience()
      setExperiences(data as Experience[])
    } catch (err) {
      console.error('Failed to fetch experience:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchExperiences() }, [])

  function resetForm() {
    setForm({ company: '', role: '', start_date: '', end_date: '', responsibilities: '', order_index: 0 })
    setEditing(null)
    setShowForm(false)
  }

  function openEdit(exp: Experience) {
    setForm({
      company: exp.company, role: exp.role,
      start_date: exp.start_date ? exp.start_date.slice(0, 10) : '',
      end_date: exp.end_date ? exp.end_date.slice(0, 10) : '',
      responsibilities: exp.responsibilities, order_index: exp.order_index,
    })
    setEditing(exp)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...form, order_index: Number(form.order_index) }
    if (editing) {
      await apiAdmin.updateExperience(editing.id, payload)
    } else {
      await apiAdmin.createExperience(payload)
    }
    resetForm()
    fetchExperiences()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this experience entry?')) return
    await apiAdmin.deleteExperience(id)
    fetchExperiences()
  }

  const columns = [
    { key: 'company', title: 'Company', render: (e: Experience) => <Link href={`/admin/experience/${e.id}`} className="text-blue-600 hover:underline">{e.company}</Link> },
    { key: 'role', title: 'Role', render: (e: Experience) => e.role },
    { key: 'start', title: 'Start', render: (e: Experience) => e.start_date ? e.start_date.slice(0, 10) : '' },
    { key: 'end', title: 'End', render: (e: Experience) => e.end_date ? e.end_date.slice(0, 10) : 'Present' },
    { key: 'order', title: 'Order', render: (e: Experience) => e.order_index },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Experience</h1>
        <Link
          href="/admin/experience/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700 inline-block"
        >
          Add Experience
        </Link>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Experience' : 'New Experience'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
            <textarea value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              {editing ? 'Save Changes' : 'Create Experience'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <AdminTable
          columns={columns}
          data={experiences}
          getKey={(e) => e.id}
          onEdit={(e) => openEdit(e)}
          onDelete={(e) => handleDelete(e.id)}
          emptyMessage="No experience entries yet. Click 'Add Experience' to create one."
        />
      )}
    </div>
  )
}
