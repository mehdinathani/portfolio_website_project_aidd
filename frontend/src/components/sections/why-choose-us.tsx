'use client'

import { motion } from 'motion/react'
import { ShieldCheck, Building2, Users, MessageSquareText, HeadphonesIcon, Lightbulb } from 'lucide-react'
import RevealSection from '@/components/motion/reveal-section'

const features = [
  {
    icon: ShieldCheck,
    title: 'Proven Track Record',
    description:
      'I have built a reputation as a trusted and reliable partner in achieving business success through consistent excellence and on-time delivery.',
  },
  {
    icon: Building2,
    title: 'Tailored Solutions',
    description:
      'Every project gets personalized solutions tailored to your specific goals, audience, and industry requirements — no cookie-cutter approaches.',
  },
  {
    icon: Users,
    title: 'Client-Centric Focus',
    description:
      'Your success is my priority. I take time to understand your business goals and align every technical decision with your vision.',
  },
  {
    icon: MessageSquareText,
    title: 'Transparent Communication',
    description:
      'I believe in open and honest communication every step of the way, ensuring you are always informed and aligned on progress.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description:
      'Your success is my priority, and I am here to support you throughout the entire journey — from concept to deployment and beyond.',
  },
  {
    icon: Lightbulb,
    title: 'Expertise Across Industries',
    description:
      'With experience spanning finance, healthcare, e-commerce, and more, I bring versatile industry knowledge to every project.',
  },
]

export default function WhyChooseUs() {
  return (
    <RevealSection>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center md:text-left">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Why Choose Me
          </h2>
          <p className="mt-3 text-muted-foreground">
            What sets my approach apart from the rest
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group rounded-lg border border-border/60 bg-background p-8 transition-colors hover:border-border hover:bg-secondary/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-border/60 bg-secondary/50 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>
    </RevealSection>
  )
}
