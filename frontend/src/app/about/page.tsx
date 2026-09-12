import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'
import StatsStrip from '@/components/sections/stats-strip'
import ProcessSteps from '@/components/sections/process-steps'
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

const aboutStats = [
  { value: '15+', label: 'Years Experience', numeric: 15, suffix: '+' },
  { value: '200+', label: 'Successful Projects', numeric: 200, suffix: '+' },
  { value: '150+', label: 'Happy Clients', numeric: 150, suffix: '+' },
  { value: '160', label: '5 Star Reviews', numeric: 160, suffix: '+' },
]

const aboutSteps = [
  {
    number: '01',
    title: 'Start a Conversation',
    description:
      'Share your vision, big or small. Whether you need a custom solution or looking to hire an expert, I\'m here to guide you every step of the way.',
  },
  {
    number: '02',
    title: 'Choose Your Engagement',
    description:
      'Fixed cost project or dedicated developer? I\'ll recommend the most cost-effective approach tailored to your goals and budget.',
  },
  {
    number: '03',
    title: 'Review Your Options',
    description:
      'I evaluate your needs and provide a strategic plan that maximizes value and efficiency — whether one-time or ongoing.',
  },
  {
    number: '04',
    title: 'Get Started & Results',
    description:
      'Your dedicated project manager ensures smooth progress. Developers seamlessly integrate with your team under expert supervision.',
  },
  {
    number: '05',
    title: 'Experience the Benefits',
    description:
      'Reduce costs by hiring skilled experts. Focus on running your business while we test new ideas safely and deliver on time.',
  },
]

export default async function AboutPage() {
  const [profile, experiences, skills] = await Promise.all([
    api.getProfile() as Promise<Profile>,
    api.getExperience() as Promise<Experience[]>,
    api.getSkills() as Promise<Skill[]>,
  ])

  const sortedExperiences = [...experiences].sort((a, b) => a.order_index - b.order_index)

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-accent/25 via-white/5 to-accent/25 blur-md" />
          <div className="relative rounded-3xl border border-white/[0.08] p-[2px]">
            <Image
              src="/second_self_mehdi_enhanced.webp"
              alt={profile.full_name}
              width={320}
              height={480}
              className="h-auto max-h-[540px] w-[260px] rounded-3xl object-cover md:w-[320px]"
              priority
            />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="type-headline text-white">
            Redefining the
            <br />
            <span className="text-white/70">Digital Narrative.</span>
          </h1>
          <p className="mt-2 text-lg text-accent/80">{profile.headline}</p>
          <p className="type-body mt-6 max-w-2xl font-light text-white/50 leading-relaxed">
            {profile.bio}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            {profile.linkedin_url && (
              <Link
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/[0.15] px-6 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
              >
                LinkedIn
              </Link>
            )}
            {profile.github_url && (
              <Link
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/[0.15] px-6 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
              >
                GitHub
              </Link>
            )}
            {profile.resume_url && (
              <Link
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-black transition-all hover:brightness-110"
              >
                Download Resume
              </Link>
            )}
          </div>
        </div>
      </div>

      <StatsStrip stats={aboutStats} className="mt-20" />

      <section className="mt-20">
        <p className="type-label mb-3 text-accent/80">The story</p>
        <h2 className="type-headline text-white">
          From Finance to Agentic AI
        </h2>
        <p className="type-body mt-3 max-w-2xl font-light text-white/50 leading-relaxed">
          After building a strong foundation in finance and data analysis, I transitioned
          into software engineering with a focus on Agentic AI systems. I combine analytical
          rigor with modern engineering practices to build intelligent, user-centric applications.
        </p>

        {sortedExperiences.length > 0 && (
          <div className="relative ml-1.5 mt-10 border-l border-white/[0.08] pl-6">
            {sortedExperiences.map((exp, i) => (
              <TimelineItem key={exp.id} experience={exp} isLast={i === sortedExperiences.length - 1} />
            ))}
          </div>
        )}
      </section>

      {skills.length > 0 && <SkillsCluster skills={skills} />}

      <ProcessSteps steps={aboutSteps} title="How I Work" />
    </main>
  )
}
