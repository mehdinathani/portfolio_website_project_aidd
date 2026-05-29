'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointMaterial, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'

const PARTICLE_COUNT = 4000

function generateParticleData() {
  const pos = new Float32Array(PARTICLE_COUNT * 3)
  const cols = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 10
    pos[i * 3 + 1] = (Math.random() - 0.5) * 6
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    const t = Math.random()
    cols[i * 3] = 0.23 + t * 0.1
    cols[i * 3 + 1] = 0.51 + t * 0.15
    cols[i * 3 + 2] = 0.96 + t * 0.04
  }
  return { positions: pos, colors: cols }
}

function ParticleCloud() {
  const ref = useRef<THREE.Points>(null!)
  const materialRef = useRef<THREE.PointsMaterial>(null!)
  const mouse = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  const { positions, colors } = useMemo(() => generateParticleData(), [])

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime
    const positionsArr = ref.current.geometry.attributes.position.array as Float32Array
    const mat = materialRef.current

    if (mat && mat.opacity < 0.8) {
      mat.opacity = Math.min(0.8, mat.opacity + 0.002)
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      const iy = i * 3 + 1

      const px = positionsArr[ix]
      const py = positionsArr[iy]

      const dx = mouse.current.x * viewport.width * 0.5 - px
      const dy = -mouse.current.y * viewport.height * 0.5 - py
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 3) {
        const force = (1 - dist / 3) * 0.02
        positionsArr[ix] += dx * force
        positionsArr[iy] += dy * force
      }

      if (Math.abs(px) > 5) positionsArr[ix] += -px * 0.001
      if (Math.abs(py) > 3) positionsArr[iy] += -py * 0.001

      const wave = Math.sin(elapsed * 0.3 + i * 0.01) * 0.002
      positionsArr[ix] += wave
      positionsArr[iy] += Math.cos(elapsed * 0.2 + i * 0.01) * 0.002
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        ref={materialRef}
        size={0.04}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  )
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 animate-[fadeIn_0.6s_ease-out]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <AdaptiveDpr pixelated />
        <ParticleCloud />
      </Canvas>
    </div>
  )
}
