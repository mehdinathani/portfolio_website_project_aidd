'use client'

import Link from 'next/link'
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react'
import TiltCard from '@/components/motion/tilt-card'
import SharedLayout from '@/components/motion/shared-layout'
import AnimatedProjectBg from '@/components/sections/animated-project-bg'
import type { Project } from '@/types/api'

interface FeaturedProjectProps {
  project: Project
}

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const bgX = useTransform(mouseX, [0, 1], [0, 30])
  const bgY = useTransform(mouseY, [0, 1], [0, 30])
  const springBgX = useSpring(bgX, { stiffness: 80, damping: 25 })
  const springBgY = useSpring(bgY, { stiffness: 80, damping: 25 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Featured Project
        </p>
        <TiltCard maxTilt={3} scale={1.01}>
          <SharedLayout layoutId={`project-${project.id}`}>
              <Link
                href={`/projects/${project.id}`}
                className="group relative flex min-h-[75vh] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-secondary"
                onMouseMove={handleMouseMove}
              >
                <AnimatedProjectBg imageUrl={project.image_url} />
                <motion.div
                  className="pointer-events-none absolute -inset-20 opacity-30"
                  style={{
                    background:
                      'radial-gradient(circle at center, hsl(var(--primary) / 0.15), transparent 70%)',
                    x: springBgX,
                    y: springBgY,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <motion.div
                className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative z-10 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-foreground md:text-5xl">
                  {project.title}
                </h2>
                <p className="mt-3 max-w-xl text-lg text-muted-foreground">
                  {project.short_description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </SharedLayout>
        </TiltCard>
      </div>
    </section>
  )
}
