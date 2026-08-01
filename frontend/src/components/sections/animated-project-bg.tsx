'use client'

import { motion } from 'motion/react'

interface AnimatedProjectBgProps {
  imageUrl?: string | null
}

export default function AnimatedProjectBg({ imageUrl }: AnimatedProjectBgProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <div
        className="h-full w-full bg-gradient-to-br from-primary/20 via-transparent to-transparent"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease-in-out infinite alternate',
        }}
      />
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}</style>
    </motion.div>
  )
}
