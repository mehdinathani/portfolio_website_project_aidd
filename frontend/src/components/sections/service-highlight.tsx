'use client'

import { CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import RevealSection from '@/components/motion/reveal-section'

const highlights = [
  'Faster load times and improved Core Web Vitals.',
  'Seamless content delivery across web, mobile, and IoT.',
  'Complete design freedom without backend constraints.',
  'Scalable architecture ready for enterprise growth.',
]

export default function ServiceHighlight() {
  return (
    <RevealSection>
      <section className="border-y border-border/40 bg-secondary/20 px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Service Highlight
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              AI-Powered Solutions
              <br />
              <span className="text-primary">for Modern Business</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The future of business is intelligent automation. I build AI-driven
              applications that transform raw data into competitive advantage —
              whether through custom LLM integrations, intelligent agents, or
              predictive analytics.
            </p>
            <ul className="mt-6 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Learn how AI can transform your workflow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-[4/3] rounded-xl border border-border/60 bg-gradient-to-br from-primary/10 via-purple-500/5 to-primary/5 p-8">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <BrainCircuit className="mx-auto h-16 w-16 text-primary/40" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    AI / ML Engineering
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  )
}

function BrainCircuit(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
      <path d="M16 8.5c.5-.5 1.5-1 3-1" />
      <path d="M18.5 11.5c.5.5 1.5 1 3 1" />
      <path d="M16 14.5c.5.5 1.5 1 3 1" />
    </svg>
  )
}
