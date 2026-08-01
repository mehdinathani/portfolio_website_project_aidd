'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import MagneticButton from '@/components/motion/magnetic-button'
import { Button } from '@/components/ui/button'

export default function ContactCta() {
  return (
    <section className="border-y border-border/40 bg-[#0c0c0e] px-6 py-28 text-center md:py-36">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Ready to Build Something Great?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Whether you&apos;re a startup looking for your first MVP or an enterprise
          needing digital modernization, I have the tools and talent to get you there.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <MagneticButton>
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
          </MagneticButton>
          <Button variant="outline" size="lg" asChild>
            <Link href="/projects">
              View My Projects
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
