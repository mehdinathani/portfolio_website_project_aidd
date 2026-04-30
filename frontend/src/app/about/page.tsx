import { api } from '@/lib/api'
import type { Profile } from '@/types/api'

export const revalidate = 60

export default async function AboutPage() {
  const profile = await api.getProfile() as Profile

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">About Me</h1>

      {profile.profile_image_url && (
        <img
          src={profile.profile_image_url}
          alt={profile.full_name}
          className="mb-8 h-48 w-48 rounded-full object-cover shadow-md"
        />
      )}

      <div className="prose prose-gray max-w-none">
        <p className="text-lg leading-relaxed text-gray-700">{profile.bio}</p>
      </div>

      {/* Finance to Tech narrative */}
      <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          From Finance to Agentic AI
        </h2>
        <p className="text-sm leading-relaxed text-gray-700">
          After building a strong foundation in finance and data analysis, I transitioned
          into software engineering with a focus on Agentic AI systems. I combine analytical
          rigor with modern engineering practices to build intelligent, user-centric applications.
        </p>
      </div>

      {/* Social links */}
      <div className="mt-10 flex flex-wrap gap-4">
        {profile.linkedin_url && (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            LinkedIn
          </a>
        )}
        {profile.github_url && (
          <a
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            GitHub
          </a>
        )}
        {profile.resume_url && (
          <a
            href={profile.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Download Resume
          </a>
        )}
      </div>
    </main>
  )
}
