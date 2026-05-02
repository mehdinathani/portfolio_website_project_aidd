'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'

export default function NewProjectPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
    short_description: '',
    tech_stack: '',
    project_url: '',
    github_url: '',
    image_url: '',
    featured: false,
    order_index: 0,
    start_date: '',
    end_date: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await apiAdmin.createProject({
        ...form,
        tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
        order_index: Number(form.order_index),
      })
      router.push('/admin/projects')
    } catch (e: any) {
      setError(e.message || 'Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-6 inline-block text-sm text-blue-600 transition-colors hover:text-blue-700"
      >
        &larr; Back to Projects
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">New Project</h1>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description</label>
          <input
            type="text"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tech Stack (comma-separated)
          </label>
          <input
            type="text"
            value={form.tech_stack}
            onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="React, TypeScript, Tailwind CSS"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project URL</label>
            <input
              type="url"
              value={form.project_url}
              onChange={(e) => setForm({ ...form, project_url: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
            <input
              type="url"
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="featured" className="text-sm text-gray-700">
            Featured project
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Project'}
          </button>
          <Link
            href="/admin/projects"
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
