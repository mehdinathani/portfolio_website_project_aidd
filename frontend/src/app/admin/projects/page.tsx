'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminTable from '@/components/admin/AdminTable'
import { apiAdmin } from '@/lib/api-admin'
import type { Project } from '@/types/api'

export const dynamic = 'force-dynamic'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

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

  async function fetchProjects() {
    setLoading(true)
    try {
      const data = await apiAdmin.getProjects()
      setProjects(data as Project[])
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  function resetForm() {
    setForm({
      title: '', description: '', short_description: '', tech_stack: '',
      project_url: '', github_url: '', image_url: '', featured: false,
      order_index: 0, start_date: '', end_date: '',
    })
    setEditing(null)
    setShowForm(false)
  }

  function openAdd() { resetForm(); setShowForm(true) }

  function openEdit(project: Project) {
    setForm({
      title: project.title, description: project.description || '',
      short_description: project.short_description || '',
      tech_stack: (project.tech_stack || []).join(', '),
      project_url: project.project_url ?? '', github_url: project.github_url ?? '',
      image_url: project.image_url ?? '', featured: project.featured,
      order_index: project.order_index,
      start_date: project.start_date ? project.start_date.slice(0, 10) : '',
      end_date: project.end_date ? project.end_date.slice(0, 10) : '',
    })
    setEditing(project)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      ...form,
      tech_stack: form.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean),
      order_index: Number(form.order_index),
    }
    if (editing) {
      await apiAdmin.updateProject(editing.id, payload)
    } else {
      await apiAdmin.createProject(payload)
    }
    resetForm()
    fetchProjects()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    await apiAdmin.deleteProject(id)
    fetchProjects()
  }

  const columns = [
    { key: 'title', title: 'Title', render: (p: Project) => p.title },
    { key: 'featured', title: 'Featured', render: (p: Project) => p.featured ? 'Yes' : 'No' },
    { key: 'order', title: 'Order', render: (p: Project) => p.order_index },
    { key: 'tech', title: 'Tech Stack', render: (p: Project) => (p.tech_stack || []).join(', ') },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700 inline-block"
        >
          Add Project
        </Link>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Project' : 'New Project'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Short Description</label>
              <input type="text" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tech Stack (comma-separated)</label>
              <input type="text" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Project URL</label>
              <input type="url" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
              <input type="url" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            Featured Project
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              {editing ? 'Save Changes' : 'Create Project'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {!showForm && (
        <AdminTable
          columns={columns}
          data={projects}
          getKey={(p) => p.id}
          onEdit={(p) => openEdit(p)}
          onDelete={(p) => handleDelete(p.id)}
          emptyMessage="No projects yet. Click 'Add Project' to create one."
        />
      )}
    </div>
  )
}
