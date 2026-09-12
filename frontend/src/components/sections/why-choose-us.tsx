'use client'

import { motion } from 'motion/react'
import { ShieldCheck, Building2, Users, MessageSquareText, HeadphonesIcon, Lightbulb } from 'lucide-react'

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
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center">
      <p className="type-label mb-4 text-accent/80">Why teams choose me</p>
      <h2 className="type-headline mx-auto max-w-3xl text-center text-white">
        Built for teams that need AI to work in the real world
      </h2>

      <div className="mt-14 grid w-full gap-6 md:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="type-title mb-3 text-white">{feature.title}</h3>
              <p className="type-body text-muted">{feature.description}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}