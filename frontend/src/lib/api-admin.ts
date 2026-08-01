const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

async function getAuthHeaders(): Promise<Record<string, string>> {
  // Dynamic import to avoid SSR issues
  const { supabase } = await import('./supabase-client')
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token ?? ''}`,
  }
}

export const apiAdmin = {
  // Projects
  getProjects: () =>
    fetch(`${BASE_URL}/api/v1/admin/projects`, {
      headers: {} as Record<string, string>,
    }).then((r) => r.json()),
  createProject: async (data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/projects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  updateProject: async (id: string, data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/projects/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  deleteProject: async (id: string) => {
    const headers = await getAuthHeaders()
    await fetch(`${BASE_URL}/api/v1/admin/projects/${id}`, {
      method: 'DELETE',
      headers,
    })
  },

  // Skills
  getSkills: () =>
    fetch(`${BASE_URL}/api/v1/admin/skills`, {
      headers: {} as Record<string, string>,
    }).then((r) => r.json()),
  createSkill: async (data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/skills`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  updateSkill: async (id: string, data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/skills/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  deleteSkill: async (id: string) => {
    const headers = await getAuthHeaders()
    await fetch(`${BASE_URL}/api/v1/admin/skills/${id}`, {
      method: 'DELETE',
      headers,
    })
  },

  // Experience
  getExperience: () =>
    fetch(`${BASE_URL}/api/v1/admin/experience`, {
      headers: {} as Record<string, string>,
    }).then((r) => r.json()),
  createExperience: async (data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/experience`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  updateExperience: async (id: string, data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/experience/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  deleteExperience: async (id: string) => {
    const headers = await getAuthHeaders()
    await fetch(`${BASE_URL}/api/v1/admin/experience/${id}`, {
      method: 'DELETE',
      headers,
    })
  },

  // Certifications
  getCertifications: () =>
    fetch(`${BASE_URL}/api/v1/admin/certifications`, {
      headers: {} as Record<string, string>,
    }).then((r) => r.json()),
  createCertification: async (data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/certifications`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  updateCertification: async (id: string, data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/certifications/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  deleteCertification: async (id: string) => {
    const headers = await getAuthHeaders()
    await fetch(`${BASE_URL}/api/v1/admin/certifications/${id}`, {
      method: 'DELETE',
      headers,
    })
  },

  // Testimonials
  getTestimonials: () =>
    fetch(`${BASE_URL}/api/v1/admin/testimonials`, {
      headers: {} as Record<string, string>,
    }).then((r) => r.json()),
  createTestimonial: async (data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/testimonials`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  updateTestimonial: async (id: string, data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/testimonials/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  deleteTestimonial: async (id: string) => {
    const headers = await getAuthHeaders()
    await fetch(`${BASE_URL}/api/v1/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers,
    })
  },

  // Knowledge Base
  getKnowledgeBase: () =>
    fetch(`${BASE_URL}/api/v1/admin/knowledge-base`, {
      headers: {} as Record<string, string>,
    }).then((r) => r.json()),
  createKBEntry: async (data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/knowledge-base`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  updateKBEntry: async (id: string, data: any) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/knowledge-base/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  deleteKBEntry: async (id: string) => {
    const headers = await getAuthHeaders()
    await fetch(`${BASE_URL}/api/v1/admin/knowledge-base/${id}`, {
      method: 'DELETE',
      headers,
    })
  },

  // Leads
  getLeads: (params?: Record<string, string>) => {
    const url = new URL(`${BASE_URL}/api/v1/admin/leads`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    return fetch(url.toString(), {
      headers: {} as Record<string, string>,
    }).then((r) => r.json())
  },
  updateLeadStatus: async (id: string, status: string) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/api/v1/admin/leads/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    })
    return res.json()
  },
  deleteLead: async (id: string) => {
    const headers = await getAuthHeaders()
    await fetch(`${BASE_URL}/api/v1/admin/leads/${id}`, {
      method: 'DELETE',
      headers,
    })
  },
}
