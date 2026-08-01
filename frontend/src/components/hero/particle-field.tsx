'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointMaterial, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'

const PARTICLE_COUNT = 4000

function generateParticleData() {
  const pos = new Float32Array(PARTICLE_COUNT * 3)
  const cols = new Float32Array(PARTICLE_COUNT * 3)
  const sizes = new Float32Array(PARTICLE_COUNT)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 12
    pos[i * 3 + 1] = (Math.random() - 0.5) * 8
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    const t = Math.random()
    cols[i * 3] = 0.23 + t * 0.1
    cols[i * 3 + 1] = 0.51 + t * 0.15
    cols[i * 3 + 2] = 0.96 + t * 0.04
    sizes[i] = 0.02 + Math.random() * 0.04
  }
  return { positions: pos, colors: cols, sizes }
}

function ParticleCloud() {
  const ref = useRef<THREE.Points>(null!)
  const materialRef = useRef<THREE.PointsMaterial>(null!)
  const mouse = useRef({ x: 0, y: 0 })
  const targetMouse = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  const { positions, colors, sizes } = useMemo(() => generateParticleData(), [])

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime
    const positionsArr = ref.current.geometry.attributes.position.array as Float32Array
    const colorsArr = ref.current.geometry.attributes.color.array as Float32Array
    const mat = materialRef.current

    if (mat && mat.opacity < 0.8) {
      mat.opacity = Math.min(0.8, mat.opacity + 0.002)
    }

    // Color cycling: slow HSL shift over time
    const hueShift = Math.sin(elapsed * 0.05) * 0.1
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ci = i * 3
      colorsArr[ci] = Math.max(0, Math.min(1, colorsArr[ci] + hueShift * 0.02))
      colorsArr[ci + 1] = Math.max(0, Math.min(1, colorsArr[ci + 1] - hueShift * 0.01))
    }

    targetMouse.current.x = mouse.current.x * viewport.width * 0.5
    targetMouse.current.y = -mouse.current.y * viewport.height * 0.5

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      const px = positionsArr[ix]
      const py = positionsArr[iy]

      const dx = targetMouse.current.x - px
      const dy = targetMouse.current.y - py
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 4 && dist > 0.01) {
        const force = (1 - dist / 4) * 0.015
        positionsArr[ix] += (dx / dist) * force
        positionsArr[iy] += (dy / dist) * force
        if (iz < positionsArr.length) {
          positionsArr[iz] += (targetMouse.current.x * 0.1 - positionsArr[iz]) * 0.01
        }
      }

      if (Math.abs(px) > 6) positionsArr[ix] += -px * 0.001
      if (Math.abs(py) > 4) positionsArr[iy] += -py * 0.001
      if (iz < positionsArr.length && Math.abs(positionsArr[iz]) > 5) {
        positionsArr[iz] += -positionsArr[iz] * 0.001
      }

      const waveX = Math.sin(elapsed * 0.3 + i * 0.01) * 0.002
      const waveY = Math.cos(elapsed * 0.2 + i * 0.01) * 0.002
      const waveZ = Math.sin(elapsed * 0.15 + i * 0.015) * 0.001
      positionsArr[ix] += waveX
      positionsArr[iy] += waveY
      if (iz < positionsArr.length) {
        positionsArr[iz] += waveZ
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.geometry.attributes.color.needsUpdate = true
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
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
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
