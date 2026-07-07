'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import RevealSection from '@/components/motion/reveal-section'

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: 'What services do you offer?',
    answer:
      'I offer a comprehensive range of services including web development, AI/ML/GenAI solutions, UI/UX design, cloud engineering, e-commerce platforms, and mobile app development. Each service is tailored to your specific business needs.',
  },
  {
    question: 'How experienced are you?',
    answer:
      'With 15+ years of professional experience spanning finance and software engineering, I bring a unique blend of business acumen and technical expertise. I hold certifications in Next.js, OpenAI Agents SDK, and Prompt Engineering.',
  },
  {
    question: 'What sets your approach apart?',
    answer:
      'My background in finance gives me a distinct perspective on business automation and fintech products. I combine analytical rigor with modern engineering practices to build intelligent, user-centric applications that deliver real business value.',
  },
  {
    question: 'How do I start a project with you?',
    answer:
      'Simply book a free consultation call. We will discuss your vision, goals, and requirements. From there, I will recommend the most cost-effective approach — whether a fixed-cost project or ongoing collaboration.',
  },
  {
    question: 'What industries do you specialize in?',
    answer:
      'I have experience across finance, healthcare, e-commerce, and technology sectors. My versatile background allows me to adapt quickly to new domains and deliver solutions that meet industry-specific requirements.',
  },
  {
    question: 'Do you offer ongoing support after delivery?',
    answer:
      'Yes. I believe in building long-term partnerships. Every project includes post-delivery support, and I offer ongoing maintenance and enhancement services to ensure your solution continues to perform optimally.',
  },
]

function FaqAccordion({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border/40">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-foreground"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-foreground md:text-base">
          {item.question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ServicesFaq() {
  return (
    <RevealSection>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about working with me
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {faqs.map((item) => (
            <FaqAccordion key={item.question} item={item} />
          ))}
        </div>
      </section>
    </RevealSection>
  )
}
