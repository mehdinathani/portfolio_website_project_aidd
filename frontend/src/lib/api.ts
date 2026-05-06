const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getProfile: () => fetchApi<any>('/api/v1/profile/'),
  getProjects: (featured?: boolean) => fetchApi<any>(`/api/v1/projects/${featured ? '?featured=true' : ''}`),
  getProject: (id: string) => fetchApi<any>(`/api/v1/projects/${id}/`),
  getSkills: () => fetchApi<any>('/api/v1/skills/'),
  getSkillsGrouped: () => fetchApi<any>('/api/v1/skills/?grouped=true'),
  getExperience: () => fetchApi<any>('/api/v1/experience/'),
  getCertifications: () => fetchApi<any>('/api/v1/certifications/'),
  getTestimonials: () => fetchApi<any>('/api/v1/testimonials/'),
  submitLead: (data: any) => fetchApi<any>('/api/v1/leads/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  sendChatMessage: (data: any) => fetchApi<any>('/api/v1/chat/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}
