import type { Metadata } from 'next'
import ServicesHero from '@/components/sections/services-hero'
import StatsStrip from '@/components/sections/stats-strip'
import ServiceGrid from '@/components/sections/service-grid'
import ServiceHighlight from '@/components/sections/service-highlight'
import ProcessSteps from '@/components/sections/process-steps'
import ServicesCta from '@/components/sections/services-cta'
import ServicesFaq from '@/components/sections/services-faq'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Software development and consulting services — web development, AI/ML, UI/UX design, cloud engineering, e-commerce, and mobile apps.',
}

const servicesStats = [
  { value: '15+', label: 'Years Experience', numeric: 15, suffix: '+' },
  { value: '200+', label: 'Successful Projects', numeric: 200, suffix: '+' },
  { value: '150+', label: 'Happy Clients', numeric: 150, suffix: '+' },
  { value: '160', label: '5 Star Reviews', numeric: 160, suffix: '+' },
]

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <StatsStrip stats={servicesStats} />
      <ServiceGrid />
      <ServiceHighlight />
      <ProcessSteps />
      <ServicesFaq />
      <ServicesCta />
    </>
  )
}
