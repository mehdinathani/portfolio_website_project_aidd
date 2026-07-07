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
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold text-foreground">
      {initial}
    </div>
  )
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-80 shrink-0 rounded-xl border border-border bg-secondary/50 p-6">
      <Stars />
      <p className="mt-3 text-sm leading-relaxed text-foreground">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-4">
        <AvatarInitial name={testimonial.author_name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {testimonial.author_name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
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
    <section className="overflow-hidden py-24">
      <h2 className="mb-2 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
        Testimonials
      </h2>
      <p className="mb-12 text-center text-muted-foreground">
        What people say about working with me
      </p>
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
