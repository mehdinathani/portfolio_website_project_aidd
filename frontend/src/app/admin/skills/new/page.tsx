'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'AI', 'Database', 'Other']

export default function NewSkillPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 50,
    order_index: 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await apiAdmin.createSkill({
        ...form,
        proficiency: Number(form.proficiency),
        order_index: Number(form.order_index),
      })
      router.push('/admin/skills')
    } catch (e: any) {
      setError(e.message || 'Failed to create skill')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/skills"
        className="mb-6 inline-block text-sm text-blue-600 transition-colors hover:text-blue-700"
      >
        &larr; Back to Skills
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">New Skill</h1>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Proficiency: {form.proficiency}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={form.proficiency}
            onChange={(e) => setForm({ ...form, proficiency: parseInt(e.target.value) })}
            className="mt-1 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Display Order</label>
          <input
            type="number"
            value={form.order_index}
            onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Skill'}
          </button>
          <Link
            href="/admin/skills"
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
