'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminTable from '@/components/admin/AdminTable'
import { apiAdmin } from '@/lib/api-admin'
import type { Skill } from '@/types/api'

export const dynamic = 'force-dynamic'

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)

  const [form, setForm] = useState({ name: '', category: '', proficiency: 50, order_index: 0 })

  async function fetchSkills() {
    setLoading(true)
    try {
      const data = await apiAdmin.getSkills()
      setSkills(data as Skill[])
    } catch (err) {
      console.error('Failed to fetch skills:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSkills() }, [])

  function resetForm() {
    setForm({ name: '', category: '', proficiency: 50, order_index: 0 })
    setEditing(null)
    setShowForm(false)
  }

  function openEdit(skill: Skill) {
    setForm({ name: skill.name, category: skill.category, proficiency: skill.proficiency, order_index: skill.order_index })
    setEditing(skill)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...form, proficiency: Number(form.proficiency), order_index: Number(form.order_index) }
    if (editing) {
      await apiAdmin.updateSkill(editing.id, payload)
    } else {
      await apiAdmin.createSkill(payload)
    }
    resetForm()
    fetchSkills()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this skill?')) return
    await apiAdmin.deleteSkill(id)
    fetchSkills()
  }

  const columns = [
    { key: 'name', title: 'Name', render: (s: Skill) => s.name },
    { key: 'category', title: 'Category', render: (s: Skill) => s.category },
    { key: 'proficiency', title: 'Proficiency', render: (s: Skill) => `${s.proficiency}%` },
    { key: 'order', title: 'Order', render: (s: Skill) => s.order_index },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Skills</h1>
        <Link
          href="/admin/skills/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow transition-colors hover:brightness-110 inline-block"
        >
          Add Skill
        </Link>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-lg font-semibold text-black">{editing ? 'Edit Skill' : 'New Skill'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/70">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70">Proficiency ({form.proficiency}%)</label>
              <input type="range" min={0} max={100} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} className="mt-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70">Order</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-black transition-colors hover:brightness-110">
              {editing ? 'Save Changes' : 'Create Skill'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/10 px-6 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.02]">Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <AdminTable
          columns={columns}
          data={skills}
          getKey={(s) => s.id}
          onEdit={(s) => openEdit(s)}
          onDelete={(s) => handleDelete(s.id)}
          emptyMessage="No skills yet. Click 'Add Skill' to create one."
        />
      )}
    </div>
  )
}
