'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ServicesCta() {
  return (
    <section className="section-surface px-6 py-28 text-center md:py-36">
      <div className="mx-auto max-w-4xl">
        <h2 className="type-headline text-white">
          Ready to Transform Your Challenges
          <br />
          <span className="text-white/70">Into Digital Triumphs?</span>
        </h2>
        <p className="type-body mx-auto mt-6 max-w-lg text-muted-foreground">
          Let&apos;s discuss how I can help you build the right solution for your business.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button variant="default" size="lg" asChild>
            <a
              href="https://cal.com/mehdinathani"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Free Consultation
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">View My Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
