import { Suspense } from 'react'
import HeroSection from '@/components/hero/hero-section'
import AboutStrip from '@/components/sections/about-strip'
import TrustStrip from '@/components/sections/trust-strip'
import StatsStrip from '@/components/sections/stats-strip'
import WhyChooseUs from '@/components/sections/why-choose-us'
import ProcessSteps from '@/components/sections/process-steps'
import ErrorBoundary from '@/components/shared/error-boundary'
import FeaturedProject from '@/components/sections/featured-project'
import ProjectsBento from '@/components/sections/projects-bento'
import SkillsCluster from '@/components/sections/skills-cluster'
import TestimonialsMarquee from '@/components/sections/testimonials-marquee'
import ContactCta from '@/components/sections/contact-cta'
import RevealSection from '@/components/motion/reveal-section'
import ParallaxSection from '@/components/motion/parallax-section'
import { api } from '@/lib/api'
import type { Profile, Project, Skill, Testimonial } from '@/types/api'

export const revalidate = 60

const defaultStats = [
  { value: '15+', label: 'Years Experience', numeric: 15, suffix: '+' },
  { value: '200+', label: 'Successful Projects', numeric: 200, suffix: '+' },
  { value: '150+', label: 'Happy Clients', numeric: 150, suffix: '+' },
  { value: '160', label: '5 Star Reviews', numeric: 160, suffix: '+' },
]

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

  try {
    [profile, projects, skills, testimonials] = await Promise.all([
      api.getProfile() as Promise<Profile>,
      api.getProjects() as Promise<Project[]>,
      api.getSkills() as Promise<Skill[]>,
      api.getTestimonials() as Promise<Testimonial[]>,
    ])
  } catch {
  }

  const featuredProject = projects.find((p) => p.featured) || projects[0]

  return (
    <>
      <HeroSection />

      <TrustStrip />

      {profile && (
        <ParallaxSection speed={0.15}>
          <RevealSection>
            <AboutStrip profile={profile} />
          </RevealSection>
        </ParallaxSection>
      )}

      <StatsStrip stats={defaultStats} />

      <WhyChooseUs />

      {featuredProject && (
        <RevealSection>
          <Suspense fallback={<SectionFallback height="75vh" />}>
            <ErrorBoundary>
              <FeaturedProject project={featuredProject} />
            </ErrorBoundary>
          </Suspense>
        </RevealSection>
      )}

      {projects.length > 0 && (
        <RevealSection>
          <Suspense fallback={<SectionFallback />}>
            <ErrorBoundary>
              <ProjectsBento
                projects={projects}
                featuredId={featuredProject?.id}
              />
            </ErrorBoundary>
          </Suspense>
        </RevealSection>
      )}

      {skills.length > 0 && (
        <RevealSection>
          <Suspense fallback={<SectionFallback />}>
            <ErrorBoundary>
              <SkillsCluster skills={skills} />
            </ErrorBoundary>
          </Suspense>
        </RevealSection>
      )}

      {testimonials.length > 0 && (
        <ParallaxSection speed={-0.1}>
          <RevealSection>
            <Suspense fallback={<SectionFallback />}>
              <ErrorBoundary>
                <TestimonialsMarquee testimonials={testimonials} />
              </ErrorBoundary>
            </Suspense>
          </RevealSection>
        </ParallaxSection>
      )}

      <ProcessSteps />

      <RevealSection>
        <ContactCta />
      </RevealSection>
    </>
  )
}
