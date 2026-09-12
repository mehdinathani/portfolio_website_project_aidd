'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

const WORD = 'Mehdi Nathani'

export default function HeroContent() {
  const letters = WORD.split('')
  const headline = 'Building production AI,'
  const headlineAccent = 'not just demos.'
  const tagline =
    'I design, build, and deploy LLM, computer vision, automation, and ML infrastructure products for startups and product teams.'

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <span className="type-label inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-white/60 backdrop-blur-sm">
          AI Product Engineer
        </span>
      </motion.div>

      <h1 className="mt-10 flex flex-col items-center">
        <span
          className="logo-wordmark flex text-[clamp(2.5rem,11vw,6.5rem)] font-semibold leading-none tracking-tight select-none"
          aria-label={WORD}
          aria-hidden="true"
        >
          {letters.map((letter, i) => (
            <span key={i} className="overflow-hidden">
              <motion.span
                className="inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(115deg,#e8fff8 0%,#b8ffed 18%,#a8ffe8 32%,#70ffd8 50%,#2dd4bf 68%,#70ffd8 82%,#a8ffe8 100%)',
                  backgroundSize: '220% 220%',
                }}
                initial={{ y: '120%', filter: 'blur(8px)', opacity: 0 }}
                animate={{ y: 0, filter: 'blur(0px)', opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.25 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            </span>
          ))}
        </span>
        <span className="sr-only">{WORD}</span>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <h2 className="type-headline max-w-3xl text-white">
          {headline} <span className="text-white/70">{headlineAccent}</span>
        </h2>
      </motion.div>

      <motion.p
        className="type-body mt-6 max-w-xl font-light text-white/50"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        {tagline}
      </motion.p>

      <motion.div
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <a
          href="https://cal.com/mehdinathani"
          target="_blank"
          rel="noopener noreferrer"
          className="type-caption inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 py-2.5 font-medium text-black transition hover:bg-white/90"
        >
          Book a 15-minute fit call
        </a>
        <Link
          href="/#portfolio"
          className="type-caption inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-6 py-2.5 font-medium text-white/70 transition hover:border-white/30 hover:text-white"
        >
          View selected work
        </Link>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-white/40 transition hover:text-white/70"
          aria-label="Scroll to about"
        >
          <span className="type-caption text-[0.7rem] tracking-widest">SCROLL</span>
          <span className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </a>
      </motion.div>
    </div>
  )
}