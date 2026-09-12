'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api-admin'
import type { Project } from '@/types/api'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [form, setForm] = useState<Partial<Project>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    apiAdmin.getProjects().then((projects: any[]) => {
      const project = projects.find((p: any) => p.id === id)
      if (project) {
        setForm({
          title: project.title || '',
          description: project.description || '',
          short_description: project.short_description || '',
          tech_stack: project.tech_stack || [],
          project_url: project.project_url || '',
          github_url: project.github_url || '',
          image_url: project.image_url || '',
          featured: project.featured || false,
          order_index: project.order_index || 0,
          start_date: project.start_date || '',
          end_date: project.end_date || '',
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
      await apiAdmin.updateProject(id, form)
      router.push('/admin/projects')
    } catch (e: any) {
      setError(e.message || 'Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return
    setDeleting(true)
    try {
      await apiAdmin.deleteProject(id)
      router.push('/admin/projects')
    } catch (e: any) {
      setError(e.message || 'Failed to delete project')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-white/40">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="text-sm text-accent transition-colors hover:text-accent"
        >
          &larr; Back to Projects
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-black">Edit Project</h1>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/70">Title</label>
          <input
            type="text"
            required
            value={form.title || ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">Short Description</label>
          <input
            type="text"
            value={form.short_description || ''}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">Description</label>
          <textarea
            rows={6}
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70">
            Tech Stack (comma-separated)
          </label>
          <input
            type="text"
            value={(form.tech_stack || []).join(', ')}
            onChange={(e) =>
              setForm({
                ...form,
                tech_stack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
            className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/70">Project URL</label>
            <input
              type="url"
              value={form.project_url || ''}
              onChange={(e) => setForm({ ...form, project_url: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">GitHub URL</label>
            <input
              type="url"
              value={form.github_url || ''}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-white/70">Start Date</label>
            <input
              type="date"
              value={form.start_date || ''}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">End Date</label>
            <input
              type="date"
              value={form.end_date || ''}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70">Display Order</label>
            <input
              type="number"
              value={form.order_index || 0}
              onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
              className="mt-1 w-full rounded-lg border border-white/10 px-4 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured || false}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="rounded border-white/10 text-accent focus:ring-accent"
          />
          <label htmlFor="featured" className="text-sm text-white/70">
            Featured project
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-black transition-colors hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-500/30 px-6 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <Link
            href="/admin/projects"
            className="rounded-lg border border-white/10 px-6 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.02]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
