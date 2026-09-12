'use client'

import { Mail } from 'lucide-react'

const EMAIL = process.env.NEXT_PUBLIC_EMAIL || 'hello@mehdinathani.com'

export default function ContactCta() {
  return (
    <section className="flex w-full flex-col items-center justify-center text-center">
      <p className="type-label mb-4 text-accent/80">Contact</p>
      <h2 className="type-headline mx-auto max-w-3xl text-white">
        Have an AI product to build?
      </h2>
      <p className="type-body mx-auto mt-6 max-w-xl font-light text-white/50">
        Let&apos;s talk about how I can help you design, build, and deploy production
        AI software — algorithmic agents, computer vision, or ML infrastructure.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <a
          href="https://cal.com/mehdinathani"
          target="_blank"
          rel="noopener noreferrer"
          className="type-caption inline-flex min-h-11 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 font-medium text-black transition-all hover:brightness-110 sm:w-auto"
        >
          <Mail className="h-4 w-4" />
          Book a 15-minute fit call
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="type-caption text-white/50 transition hover:text-white"
        >
          Or email me directly at {EMAIL}
        </a>
      </div>
    </section>
  )
}