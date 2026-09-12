'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'
import type { Skill } from '@/types/api'

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'AI', 'Database', 'Other']

export default function EditSkillPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [form, setForm] = useState<Partial<Skill>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    apiAdmin.getSkills().then((skills: any[]) => {
      const skill = skills.find((s: any) => s.id === id)
      if (skill) {
        setForm({
          name: skill.name || '',
          category: skill.category || 'Other',
          proficiency: skill.proficiency || 50,
          icon_url: skill.icon_url || '',
          order_index: skill.order_index || 0,
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
      await apiAdmin.updateSkill(id, form)
      router.push('/admin/skills')
    } catch (e: any) {
      setError(e.message || 'Failed to save skill')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-white/40">Loading...</div>
  }

  return (
    <div>
      <Link
        href="/admin/skills"
        className="mb-6 inline-block text-sm text-accent transition-colors hover:text-accent"
      >
        &larr; Back to Skills
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-black">Edit Skill</h1>

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
          <label className="block text-sm font-medium text-white/70">Category</label>
          <select
            value={form.category || 'Other'}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">
            Proficiency: {form.proficiency || 50}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={form.proficiency || 50}
            onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })}
            className="mt-1 w-full"
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
          <Link
            href="/admin/skills"
            className="rounded-lg border border-white/10 px-6 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.02]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
