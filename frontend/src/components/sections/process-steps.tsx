'use client'

import { motion } from 'motion/react'
import RevealSection from '@/components/motion/reveal-section'

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

export default function ProcessSteps({
  steps = defaultSteps,
  title = 'Here\'s How It Works',
  subtitle,
}: ProcessStepsProps) {
  return (
    <RevealSection>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative text-center md:text-left"
            >
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Step
              </span>
              <span className="font-display block text-6xl font-bold tracking-tighter text-primary/15 md:text-7xl">
                {step.number}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              {i < steps.length - 1 && (
                <div className="mt-6 hidden h-px bg-border/60 md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </RevealSection>
  )
}
