'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Project {
  id: string
  title: string
}

interface Lead {
  id: string
  name: string
  email: string
  category: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalLeads: 0,
    newLeads: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) return

      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      }

      try {
        const [projectsRes, leadsRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/projects`, { headers }),
          fetch(`${API_BASE}/api/v1/admin/leads`, { headers }),
        ])

        const projects: Project[] = projectsRes.ok ? await projectsRes.json() : []
        const leads: Lead[] = leadsRes.ok ? await leadsRes.json() : []

        setStats({
          totalProjects: projects.length,
          totalLeads: leads.length,
          newLeads: leads.filter((l) => l.status === 'new').length,
        })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Projects', value: stats.totalProjects, color: 'blue' },
    { label: 'Total Leads', value: stats.totalLeads, color: 'green' },
    { label: 'New Leads', value: stats.newLeads, color: 'yellow' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">Loading stats...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`rounded-lg border p-6 shadow-sm ${colorMap[card.color]}`}
            >
              <p className="text-sm font-medium">{card.label}</p>
              <p className="mt-2 text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
