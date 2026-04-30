'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  order_index: number
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)

  const [form, setForm] = useState({
    name: '',
    category: '',
    proficiency: 50,
    order_index: 0,
  })

  async function getAuthHeaders(): Promise<Record<string, string>> {
    const { data: sessionData } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionData.session?.access_token}`,
    }
  }

  async function fetchSkills() {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${API_BASE}/api/v1/skills`, { headers })
      if (res.ok) {
        setSkills(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  function resetForm() {
    setForm({ name: '', category: '', proficiency: 50, order_index: 0 })
    setEditing(null)
    setShowForm(false)
  }

  function openAdd() {
    resetForm()
    setShowForm(true)
  }

  function openEdit(skill: Skill) {
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      order_index: skill.order_index,
    })
    setEditing(skill)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const headers = await getAuthHeaders()
    const payload = { ...form, proficiency: Number(form.proficiency), order_index: Number(form.order_index) }

    const url = editing
      ? `${API_BASE}/api/v1/skills/${editing.id}`
      : `${API_BASE}/api/v1/skills`
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, { method, headers, body: JSON.stringify(payload) })
    if (res.ok) {
      resetForm()
      fetchSkills()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this skill?')) return
    const headers = await getAuthHeaders()
    await fetch(`${API_BASE}/api/v1/skills/${id}`, { method: 'DELETE', headers })
    fetchSkills()
  }

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category || 'Uncategorized'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <button
          onClick={openAdd}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Add Skill
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold">{editing ? 'Edit Skill' : 'New Skill'}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Proficiency ({form.proficiency}%)</label>
              <input type="range" min={0} max={100} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} className="mt-1 w-full" />
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
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="mb-2 text-lg font-semibold text-gray-800">{category}</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left">
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Proficiency</th>
                      <th className="px-3 py-2">Order</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((s) => (
                      <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium">{s.name}</td>
                        <td className="px-3 py-2">{s.proficiency}%</td>
                        <td className="px-3 py-2">{s.order_index}</td>
                        <td className="px-3 py-2 space-x-2">
                          <button onClick={() => openEdit(s)} className="text-sm text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleDelete(s.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="py-4 text-center text-gray-500">No skills yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
