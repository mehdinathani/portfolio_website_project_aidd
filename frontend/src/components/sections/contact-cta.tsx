'use client'

import MagneticButton from '@/components/motion/magnetic-button'
import { Button } from '@/components/ui/button'

export default function ContactCta() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
        Let&apos;s build something.
      </h2>
      <p className="mt-6 max-w-md text-lg text-muted-foreground">
        I&apos;m always open to discussing new projects, opportunities, and ideas.
      </p>
      <div className="mt-10">
        <MagneticButton>
          <Button variant="default" size="lg" asChild>
            <a href="https://cal.com/mehdinathani" target="_blank" rel="noopener noreferrer">
              Book a call &rarr;
            </a>
          </Button>
        </MagneticButton>
      </div>
    </section>
  )
}
