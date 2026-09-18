import { supabase } from './supabase-client'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

async function authHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('No authenticated session')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  }
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = await authHeaders()
  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export const apiAdmin = {
  // Projects
  getProjects: async () => apiFetch(`${BASE_URL}/api/v1/admin/projects`),
  createProject: async (data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: async (id: string, data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProject: async (id: string) =>
    apiFetch(`${BASE_URL}/api/v1/admin/projects/${id}`, { method: 'DELETE' }),

  // Skills
  getSkills: async () => apiFetch(`${BASE_URL}/api/v1/admin/skills`),
  createSkill: async (data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/skills`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSkill: async (id: string, data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSkill: async (id: string) =>
    apiFetch(`${BASE_URL}/api/v1/admin/skills/${id}`, { method: 'DELETE' }),

  // Experience
  getExperience: async () => apiFetch(`${BASE_URL}/api/v1/admin/experience`),
  createExperience: async (data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/experience`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateExperience: async (id: string, data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteExperience: async (id: string) =>
    apiFetch(`${BASE_URL}/api/v1/admin/experience/${id}`, { method: 'DELETE' }),

  // Certifications
  getCertifications: async () =>
    apiFetch(`${BASE_URL}/api/v1/admin/certifications`),
  createCertification: async (data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/certifications`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCertification: async (id: string, data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCertification: async (id: string) =>
    apiFetch(`${BASE_URL}/api/v1/admin/certifications/${id}`, {
      method: 'DELETE',
    }),

  // Testimonials
  getTestimonials: async () =>
    apiFetch(`${BASE_URL}/api/v1/admin/testimonials`),
  createTestimonial: async (data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/testimonials`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTestimonial: async (id: string, data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTestimonial: async (id: string) =>
    apiFetch(`${BASE_URL}/api/v1/admin/testimonials/${id}`, {
      method: 'DELETE',
    }),

  // Knowledge Base
  getKnowledgeBase: async () =>
    apiFetch(`${BASE_URL}/api/v1/admin/knowledge-base`),
  createKBEntry: async (data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/knowledge-base`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateKBEntry: async (id: string, data: any) =>
    apiFetch(`${BASE_URL}/api/v1/admin/knowledge-base/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteKBEntry: async (id: string) =>
    apiFetch(`${BASE_URL}/api/v1/admin/knowledge-base/${id}`, {
      method: 'DELETE',
    }),

  // Leads
  getLeads: async (params?: Record<string, string>) => {
    const url = new URL(`${BASE_URL}/api/v1/admin/leads`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    return apiFetch(url.toString())
  },
  updateLeadStatus: async (id: string, status: string) =>
    apiFetch(`${BASE_URL}/api/v1/admin/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteLead: async (id: string) =>
    apiFetch(`${BASE_URL}/api/v1/admin/leads/${id}`, { method: 'DELETE' }),
}
