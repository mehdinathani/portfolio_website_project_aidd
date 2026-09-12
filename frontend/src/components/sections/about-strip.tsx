'use client'

import Image from 'next/image'
import type { Profile } from '@/types/api'

interface AboutStripProps {
  profile: Profile | null
}

export default function AboutStrip({ profile }: AboutStripProps) {
  if (!profile) return null

  return (
    <section className="flex flex-col items-center justify-center text-center">
      {profile.profile_image_url ? (
        <Image
          src={profile.profile_image_url}
          alt={profile.full_name}
          width={96}
          height={96}
          priority
          className="mb-8 h-24 w-24 rounded-2xl border border-white/[0.08] object-cover"
        />
      ) : (
        <Image
          src="/portrait_self_mehdi_enhanced.webp"
          alt={profile.full_name}
          width={96}
          height={96}
          priority
          className="mb-8 h-24 w-24 rounded-2xl border border-white/[0.08] object-cover"
        />
      )}

      <p className="type-label mb-4 text-accent/80">What I do</p>
      <h2 className="type-headline mx-auto max-w-3xl text-white">
        More than a prototype. Software your team can rely on.
      </h2>
      <p className="type-body mx-auto mt-6 max-w-2xl font-light text-white/50">
        {profile.bio}
      </p>
    </section>
  )
}