import Image from 'next/image'
import { api } from '@/lib/api'
import TimelineItem from '@/components/sections/timeline-item'
import SkillsCluster from '@/components/sections/skills-cluster'
import type { Profile, Experience, Skill } from '@/types/api'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Mehdi Abbas Nathani — from finance to Agentic AI engineering. Background, experience, skills, and journey.',
}

export default async function AboutPage() {
  const [profile, experiences, skills] = await Promise.all([
    api.getProfile() as Promise<Profile>,
    api.getExperience() as Promise<Experience[]>,
    api.getSkills() as Promise<Skill[]>,
  ])

  const sortedExperiences = [...experiences].sort((a, b) => a.order_index - b.order_index)

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-10">
        {profile.profile_image_url && (
          <Image
            src={profile.profile_image_url}
            alt={profile.full_name}
            width={160}
            height={160}
            className="mb-6 shrink-0 rounded-2xl object-cover md:mb-0"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            {profile.full_name}
          </h1>
          <p className="mt-1 text-lg text-primary">{profile.headline}</p>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            {profile.bio}
          </p>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="mb-2 text-2xl font-bold text-foreground">From Finance to Agentic AI</h2>
        <p className="mb-8 text-muted-foreground">
          After building a strong foundation in finance and data analysis, I transitioned
          into software engineering with a focus on Agentic AI systems. I combine analytical
          rigor with modern engineering practices to build intelligent, user-centric applications.
        </p>

        {sortedExperiences.length > 0 && (
          <div className="relative ml-1.5 border-l border-border pl-6">
            {sortedExperiences.map((exp, i) => (
              <TimelineItem key={exp.id} experience={exp} isLast={i === sortedExperiences.length - 1} />
            ))}
          </div>
        )}
      </section>

      {skills.length > 0 && <SkillsCluster skills={skills} />}

      <div className="mt-16 flex flex-wrap justify-center gap-4">
        {profile.linkedin_url && (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            LinkedIn
          </a>
        )}
        {profile.github_url && (
          <a
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            GitHub
          </a>
        )}
        {profile.resume_url && (
          <a
            href={profile.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Download Resume
          </a>
        )}
      </div>
    </main>
  )
}
