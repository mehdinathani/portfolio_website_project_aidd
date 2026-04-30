import Link from 'next/link'
import type { Profile } from '@/types/api'

interface HeroProps {
  profile: Profile
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 text-center">
      {profile.profile_image_url && (
        <img
          src={profile.profile_image_url}
          alt={profile.full_name}
          className="h-32 w-32 rounded-full object-cover shadow-md"
        />
      )}

      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        {profile.full_name}
      </h1>

      <p className="text-xl font-medium text-blue-600">{profile.headline}</p>

      <p className="max-w-2xl text-gray-600">{profile.bio}</p>

      <div className="flex gap-4">
        <Link
          href="/projects"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-700"
        >
          View Projects
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
        >
          Contact Me
        </Link>
      </div>

      {profile.resume_url && (
        <a
          href={profile.resume_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-700"
        >
          Download Resume
        </a>
      )}
    </section>
  )
}
