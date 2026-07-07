import { Star } from 'lucide-react'

export default function ServicesHero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 md:py-36">
      <div className="text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
          My Expertise
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl md:leading-[1.1]">
          Software Development
          <br />
          <span className="text-primary">and Consulting</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          As a dedicated software engineer, I help startups and enterprises realize their
          business goals with advanced, intelligent software solutions tailored to their needs.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span>200+ 5 Star Reviews</span>
        </div>
      </div>
    </section>
  )
}
