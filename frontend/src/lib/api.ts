const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  timeout?: number
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchApi<T>(path: string, options?: RequestInit & RetryOptions): Promise<T> {
  const {
    maxRetries = 0,
    baseDelay = 500,
    timeout = 10000,
    ...fetchOptions
  } = options || {}

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...fetchOptions,
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', ...fetchOptions?.headers },
      })

      if (res.ok) {
        clearTimeout(timeoutId)
        return res.json()
      }

      if (res.status < 500) {
        clearTimeout(timeoutId)
        throw new Error(`API error: ${res.status}`)
      }

      lastError = new Error(`API error: ${res.status}`)

      if (attempt < maxRetries) {
        const retryAfter = res.headers.get('Retry-After')
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : baseDelay * Math.pow(2, attempt)
        await delay(waitMs)
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        clearTimeout(timeoutId)
        throw new Error('Request timed out')
      }
      lastError = e
      if (attempt < maxRetries) {
        await delay(baseDelay * Math.pow(2, attempt))
      }
    }
  }

  clearTimeout(timeoutId)
  throw lastError || new Error('Request failed')
}

export const api = {
  getProfile: () => fetchApi<any>('/api/v1/profile/'),
  getProjects: (featured?: boolean) => fetchApi<any>(`/api/v1/projects/${featured ? '?featured=true' : ''}`, { maxRetries: 3 }),
  getProject: (id: string) => fetchApi<any>(`/api/v1/projects/${id}/`, { maxRetries: 3 }),
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
