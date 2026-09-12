'use client'

import { Star } from 'lucide-react'
import Marquee from '@/components/motion/marquee'
import type { Testimonial } from '@/types/api'

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[]
}

function AvatarInitial({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase()
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-sm font-semibold tracking-wide text-accent">
      {initial}
    </div>
  )
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-accent/70 text-accent/70" />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-80 shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
      <Stars />
      <p className="type-card-body mt-3 text-white">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-4">
        <AvatarInitial name={testimonial.author_name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {testimonial.author_name}
          </p>
          <p className="truncate text-xs text-white/50">
            {testimonial.author_role}
            {testimonial.author_company ? `, ${testimonial.author_company}` : ''}
          </p>
        </div>
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
    <section className="marquee-fade flex w-full flex-col items-center justify-center overflow-hidden py-4">
      <p className="type-label mb-6 text-accent/80">What people say</p>
      <div className="flex w-full flex-col gap-6">
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