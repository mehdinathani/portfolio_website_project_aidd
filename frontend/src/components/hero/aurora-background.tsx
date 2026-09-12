'use client'

import CanvasParticles from '@/components/hero/canvas-particles'

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#030303]" />
      <div className="aurora-curtain aurora-curtain-1" />
      <div className="aurora-curtain aurora-curtain-2" />
      <div className="aurora-curtain aurora-curtain-3" />

      <div
        className="absolute h-[24rem] w-[24rem] rounded-full opacity-[0.18] blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #70ffd8 0%, transparent 70%)',
          left: '12%',
          top: '18%',
          animation: 'pulseSoft 26s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute h-[20rem] w-[20rem] rounded-full opacity-[0.12] blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)',
          right: '10%',
          top: '22%',
          animation: 'pulseSoft 30s ease-in-out infinite',
          animationDelay: '-6s',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute h-[26rem] w-[26rem] rounded-full opacity-[0.14] blur-[110px]"
        style={{
          background: 'radial-gradient(circle, #5eead4 0%, transparent 70%)',
          left: '40%',
          bottom: '-10%',
          animation: 'pulseSoft 22s ease-in-out infinite',
          animationDelay: '-12s',
          willChange: 'transform',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-teal-950/25 to-transparent" />

      <CanvasParticles />
    </div>
  )
}