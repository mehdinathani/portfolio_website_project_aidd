'use client'

import { motion } from 'motion/react'
import {
  Globe,
  BrainCircuit,
  Palette,
  Cloud,
  ShoppingBag,
  Smartphone,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import RevealSection from '@/components/motion/reveal-section'

interface Service {
  icon: React.ElementType
  title: string
  description: string
  href: string
}

const services: Service[] = [
  {
    icon: Globe,
    title: 'Web Development',
    description:
      'Transforming complex business logic into intuitive, high-performance web applications built for scale and speed.',
    href: '#',
  },
  {
    icon: BrainCircuit,
    title: 'AI / ML / GenAI',
    description:
      'Leverage cutting-edge artificial intelligence and generative models to automate processes and derive actionable insights.',
    href: '#',
  },
  {
    icon: Palette,
    title: 'UI / UX Design',
    description:
      'User-centric design philosophies that prioritize clarity, accessibility, and delightful digital interactions.',
    href: '#',
  },
  {
    icon: Cloud,
    title: 'Cloud Engineering',
    description:
      'Architecting robust, secure, and elastic cloud infrastructures that empower your business to grow without boundaries.',
    href: '#',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce',
    description:
      'Developing high-conversion retail platforms and headless commerce solutions for the modern digital marketplace.',
    href: '#',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description:
      'Native and cross-platform mobile solutions that keep your brand in your customers\' pockets, 24/7.',
    href: '#',
  },
]

export default function ServiceGrid() {
  return (
    <RevealSection>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14">
          <p className="type-label mb-3 text-accent/80">Engagements mapped to real needs</p>
          <h2 className="type-headline text-white">My Core Services</h2>
          <p className="type-caption mt-3 text-muted-foreground">
            What I can do for you and your business
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="type-title text-white">
                  {service.title}
                </h3>
                <p className="type-card-body mt-2 flex-1 text-muted">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="type-caption mt-4 inline-flex items-center gap-1.5 font-medium text-accent transition hover:text-accent/80"
                >
                  Explore Service
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </RevealSection>
  )
}
