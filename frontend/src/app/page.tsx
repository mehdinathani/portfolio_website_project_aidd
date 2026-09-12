import { Suspense } from 'react'
import HeroSection from '@/components/hero/hero-section'
import AboutStrip from '@/components/sections/about-strip'
import ProblemStatement from '@/components/sections/problem-statement'
import StatsStrip from '@/components/sections/stats-strip'
import WhyChooseUs from '@/components/sections/why-choose-us'
import ProcessSteps from '@/components/sections/process-steps'
import ErrorBoundary from '@/components/shared/error-boundary'
import FeaturedProject from '@/components/sections/featured-project'
import SkillsCluster from '@/components/sections/skills-cluster'
import TestimonialsMarquee from '@/components/sections/testimonials-marquee'
import ContactCta from '@/components/sections/contact-cta'
import RevealSection from '@/components/motion/reveal-section'
import { api } from '@/lib/api'
import type { Profile, Project, Skill, Testimonial, Experience } from '@/types/api'

export const revalidate = 60

function SectionFallback({ height = '50vh' }: { height?: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: height }}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

export default async function HomePage() {
  let profile: Profile | null = null
  let projects: Project[] = []
  let skills: Skill[] = []
  let testimonials: Testimonial[] = []
  let experience: Experience[] = []

  try {
    [profile, projects, skills, testimonials, experience] = await Promise.all([
      api.getProfile() as Promise<Profile>,
      api.getProjects() as Promise<Project[]>,
      api.getSkills() as Promise<Skill[]>,
      api.getTestimonials() as Promise<Testimonial[]>,
      api.getExperience() as Promise<Experience[]>,
    ])
  } catch {
  }

  const featuredProject = projects.find((p) => p.featured) || projects[0]

  const yearsBuilding =
    experience.length > 0
      ? Math.max(
          1,
          new Date().getFullYear() -
            Math.min(
              ...experience.map((e) =>
                e.start_date ? new Date(e.start_date).getFullYear() : new Date().getFullYear()
              )
            )
        )
      : 0

  const stats = [
    {
      value: `${projects.length}+`,
      label: 'Projects Delivered',
      numeric: projects.length,
      suffix: '+',
    },
    {
      value: `${yearsBuilding}+`,
      label: 'Years Experience',
      numeric: yearsBuilding,
      suffix: '+',
    },
    {
      value: `${skills.length}+`,
      label: 'Technologies',
      numeric: skills.length,
      suffix: '+',
    },
    {
      value: `${testimonials.length}+`,
      label: 'Testimonials',
      numeric: testimonials.length,
      suffix: '+',
    },
  ].filter((s) => s.numeric > 0)

  return (
    <>
      <HeroSection />
      <div className="section-divider" />

      <WrapSection id="problem">
        <RevealSection>
          <ProblemStatement />
        </RevealSection>
      </WrapSection>
      <div className="section-divider" />

      {profile && (
        <WrapSection id="about" surface>
          <RevealSection>
            <AboutStrip profile={profile} />
          </RevealSection>
          {skills.length > 0 && (
            <div className="mt-16 w-full">
              <RevealSection>
                <SkillsCluster skills={skills} />
              </RevealSection>
            </div>
          )}
        </WrapSection>
      )}
      <div className="section-divider" />

      {stats.length > 0 && (
        <WrapSection id="stats">
          <RevealSection>
            <StatsStrip stats={stats} />
          </RevealSection>
        </WrapSection>
      )}
      <div className="section-divider" />

      <WrapSection id="trust" glow>
        <RevealSection>
          <WhyChooseUs />
        </RevealSection>
      </WrapSection>
      <div className="section-divider" />

      {featuredProject && (
        <WrapSection id="portfolio" glow>
          <div className="flex min-h-full flex-col justify-center">
            <SectionHeader
              label="Selected work"
              title="Production AI, shipped"
              subtitle="A few things I have built and deployed."
            />
            <RevealSection>
              <Suspense fallback={<SectionFallback height="60vh" />}>
                <ErrorBoundary>
                  <FeaturedProject project={featuredProject} />
                </ErrorBoundary>
              </Suspense>
            </RevealSection>
          </div>
        </WrapSection>
      )}
      <div className="section-divider" />

      <WrapSection id="process">
        <ProcessSteps />
      </WrapSection>

      {testimonials.length > 0 && (
        <>
          <div className="section-divider" />
          <WrapSection id="testimonials" glow>
            <RevealSection>
              <Suspense fallback={<SectionFallback />}>
                <ErrorBoundary>
                  <TestimonialsMarquee testimonials={testimonials} />
                </ErrorBoundary>
              </Suspense>
            </RevealSection>
          </WrapSection>
        </>
      )}
      <div className="section-divider" />

      <WrapSection id="contact" surface>
        <RevealSection>
          <ContactCta />
        </RevealSection>
      </WrapSection>
    </>
  )
}

function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="px-6 pb-4 text-center md:pb-8">
      <p className="type-label mb-4 text-accent/80">{label}</p>
      <h2 className="type-headline mx-auto max-w-3xl text-white">{title}</h2>
      {subtitle && (
        <p className="type-caption mt-3 text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}

function WrapSection({
  children,
  id,
  surface,
  glow,
}: {
  children: React.ReactNode
  id?: string
  surface?: boolean
  glow?: boolean
}) {
  return (
    <section
      id={id}
      className={`snap-section relative flex w-full flex-col justify-center px-4 py-14 md:px-6 ${
        surface ? 'section-surface' : glow ? 'section-glow' : ''
      }`}
    >
      {children}
    </section>
  )
}