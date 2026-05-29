import { api } from '@/lib/api'
import ProjectsPage from './ProjectsPage'
import type { Project } from '@/types/api'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function ProjectsPageWrapper() {
  const projects = await api.getProjects() as Project[]
  return <ProjectsPage projects={projects} />
}
