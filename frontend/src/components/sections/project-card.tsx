import Link from 'next/link'
import type { Project } from '@/types/api'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {project.image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>

        <p className="text-sm text-gray-600">{project.short_description}</p>

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {project.project_url && (
            <Link
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Live Demo &rarr;
            </Link>
          )}
          {project.github_url && (
            <Link
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-800"
            >
              GitHub &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
