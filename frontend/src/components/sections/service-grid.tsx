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
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            My Core Services
          </h2>
          <p className="mt-3 text-muted-foreground">
            What I can do for you and your business
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group flex flex-col rounded-lg border border-border/60 bg-background p-6 transition-colors hover:border-border hover:bg-secondary/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-secondary/50 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
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
