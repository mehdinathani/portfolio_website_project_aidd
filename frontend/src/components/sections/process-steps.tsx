'use client'

import { motion } from 'motion/react'
import { Target, FlaskConical, Rocket } from 'lucide-react'

interface Step {
  number: string
  title: string
  description: string
}

interface ProcessStepsProps {
  steps?: Step[]
  title?: string
  subtitle?: string
}

const defaultSteps: Step[] = [
  {
    number: '01',
    title: 'Start a Conversation',
    description:
      'Share your vision, big or small. Whether you need a custom solution or are looking to hire an expert, I\'m here to guide you every step of the way.',
  },
  {
    number: '02',
    title: 'Choose Your Engagement',
    description:
      'Fixed-cost project or dedicated collaboration? I\'ll recommend the most cost-effective approach tailored to your goals and budget.',
  },
  {
    number: '03',
    title: 'Experience the Benefits',
    description:
      'Reduce costs, grow faster, and focus on running your business while I handle the technical execution with precision and care.',
  },
]

const STEP_ICONS = [Target, FlaskConical, Rocket]

export default function ProcessSteps({
  steps = defaultSteps,
  title = 'From idea to production',
  subtitle,
}: ProcessStepsProps) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center">
      <p className="type-label mb-4 text-accent/80">How I work</p>
      <h2 className="type-headline mx-auto max-w-3xl text-center text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="type-caption mt-3 text-muted-foreground">{subtitle}</p>
      )}

      <div className="mt-14 grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[i % STEP_ICONS.length]
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center md:text-left"
            >
              <div className="mb-3 flex items-center justify-center gap-2 md:justify-start">
                <Icon className="h-4 w-4 text-accent" />
                <span className="type-label text-accent/80">Step {step.number}</span>
              </div>
              <h3 className="type-title mb-2 text-white">{step.title}</h3>
              <p className="type-body text-muted">{step.description}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}