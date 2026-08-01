import { api } from '@/lib/api'
import ProjectsPage from './ProjectsPage'
import type { Project } from '@/types/api'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore portfolio projects by Mehdi Abbas Nathani — AI-powered applications, software engineering, and intelligent systems.',
}

export default async function ProjectsPageWrapper() {
  const projects = await api.getProjects() as Project[]
  return <ProjectsPage projects={projects} />
}
