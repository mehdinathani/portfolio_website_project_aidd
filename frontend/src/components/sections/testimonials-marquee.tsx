'use client'

import Marquee from '@/components/motion/marquee'
import type { Testimonial } from '@/types/api'

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[]
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-80 shrink-0 rounded-xl border border-border bg-secondary p-6">
      <p className="text-sm leading-relaxed text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-4 border-t border-border pt-3">
        <p className="text-sm font-semibold text-foreground">{testimonial.author_name}</p>
        <p className="text-xs text-muted-foreground">
          {testimonial.author_role}
          {testimonial.author_company ? `, ${testimonial.author_company}` : ''}
        </p>
      </div>
    </div>
  )
}

export default function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  if (testimonials.length === 0) return null

  const mid = Math.ceil(testimonials.length / 2)
  const row1 = testimonials.slice(0, mid)
  const row2 = testimonials.slice(mid)

  return (
    <section className="overflow-hidden py-24">
      <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
        Testimonials
      </h2>
      <div className="flex flex-col gap-6">
        <Marquee speed={25} direction="left">
          {row1.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </Marquee>
        <Marquee speed={25} direction="right">
          {row2.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
