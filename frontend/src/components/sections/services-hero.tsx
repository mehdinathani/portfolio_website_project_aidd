import { Star } from 'lucide-react'

export default function ServicesHero() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      <p className="type-label mb-4 text-accent/80">How I help</p>
      <h1 className="type-headline text-white">
        Software Development
        <br />
        <span className="text-white/70">and Consulting</span>
      </h1>
      <p className="type-body mx-auto mt-6 max-w-2xl font-light text-white/50">
        As a dedicated software engineer, I help startups and enterprises realize their
        business goals with advanced, intelligent software solutions tailored to their needs.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/50">
        <Star className="h-4 w-4 fill-accent/70 text-accent/70" />
        <span>200+ 5 Star Reviews</span>
      </div>
    </section>
  )
}