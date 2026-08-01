'use client'

import Image from 'next/image'
import TiltCard from '@/components/motion/tilt-card'
import type { Profile } from '@/types/api'

interface AboutStripProps {
  profile: Profile | null
}

export default function AboutStrip({ profile }: AboutStripProps) {
  if (!profile) return null

  return (
    <section className="flex min-h-[50vh] items-center justify-center px-6 py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:gap-16">
        <TiltCard className="shrink-0" maxTilt={8} scale={1}>
          {profile.profile_image_url ? (
            <Image
              src={profile.profile_image_url}
              alt={profile.full_name}
              width={120}
              height={120}
              className="rounded-2xl object-cover"
            />
          ) : (
            <Image
              src="/portrait_self_mehdi_enhanced.webp"
              alt={profile.full_name}
              width={120}
              height={120}
              className="rounded-2xl object-cover"
            />
          )}
        </TiltCard>
        <div className="text-center md:text-left">
          <p className="text-2xl font-light leading-relaxed text-foreground md:text-3xl">
            {profile.bio}
          </p>
        </div>
      </div>
    </section>
  )
}
