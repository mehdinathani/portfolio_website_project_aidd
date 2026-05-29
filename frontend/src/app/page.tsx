import HeroSection from '@/components/hero/hero-section'
import AboutStrip from '@/components/sections/about-strip'
import FeaturedProject from '@/components/sections/featured-project'
import ProjectsBento from '@/components/sections/projects-bento'
import SkillsCluster from '@/components/sections/skills-cluster'
import TestimonialsMarquee from '@/components/sections/testimonials-marquee'
import ContactCta from '@/components/sections/contact-cta'
import { api } from '@/lib/api'
import type { Profile, Project, Skill, Testimonial } from '@/types/api'

export const revalidate = 60

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
    // During build or when backend is unavailable, use empty/fallback data
  }

  const featuredProject = projects.find((p) => p.featured) || projects[0]

  return (
    <>
      <HeroSection />

      {profile && <AboutStrip profile={profile} />}

      {featuredProject && <FeaturedProject project={featuredProject} />}

      {projects.length > 0 && (
        <ProjectsBento
          projects={projects}
          featuredId={featuredProject?.id}
        />
      )}

      {skills.length > 0 && <SkillsCluster skills={skills} />}

      {testimonials.length > 0 && (
        <TestimonialsMarquee testimonials={testimonials} />
      )}

      <ContactCta />
    </>
  )
}
