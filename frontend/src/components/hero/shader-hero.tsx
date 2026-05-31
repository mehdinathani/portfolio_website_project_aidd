'use client'

import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import { useScroll } from 'motion/react'
import vertexShader from './shaders/hero-flowfield.vert.glsl'
import fragmentShader from './shaders/hero-flowfield.frag.glsl'
import { generateTextSDF } from './shaders/create-text-sdf'

interface FlowfieldSceneProps {
  reducedMotion: boolean
  onCompileError?: () => void
}

function FlowfieldScene({ reducedMotion, onCompileError }: FlowfieldSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const { size } = useThree()
  const mouseTarget = useRef(new THREE.Vector2(size.width / 2, size.height / 2))
  const mouseSmooth = useRef(new THREE.Vector2(size.width / 2, size.height / 2))
  const progressRef = useRef(0)
  const errorReported = useRef(false)

  const sdfTexture = useMemo(() => {
    const canvas = generateTextSDF()
    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return tex
  }, [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(size.width / 2, size.height / 2) },
    uProgress: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uTextSDF: { value: sdfTexture },
  }), [sdfTexture, size])

  const { scrollY } = useScroll()

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.current.set(e.clientX, e.clientY)
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      const vh = window.innerHeight
      progressRef.current = Math.min(1, latest / vh)
    })
    return () => unsubscribe()
  }, [scrollY])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onCompileError && !errorReported.current) {
        const mat = materialRef.current
        if (mat && !mat.uniforms) {
          errorReported.current = true
          console.error('[ShaderHero] ShaderMaterial uniforms not initialized')
          onCompileError()
        }
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [onCompileError])

  useFrame(() => {
    const mat = materialRef.current
    if (!mat) return

    const mx = mouseTarget.current.x
    const my = mouseTarget.current.y

    mouseSmooth.current.x += (mx - mouseSmooth.current.x) * 0.08
    mouseSmooth.current.y += (my - mouseSmooth.current.y) * 0.08

    if (!reducedMotion) {
      const elapsed = performance.now() / 1000
      mat.uniforms.uTime.value = elapsed
      mat.uniforms.uProgress.value = progressRef.current
    }

    mat.uniforms.uMouse.value.set(mouseSmooth.current.x, mouseSmooth.current.y)
    mat.uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function CanvasAriaSetter() {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement as HTMLCanvasElement
    canvas.setAttribute('aria-hidden', 'true')
    canvas.setAttribute('role', 'presentation')
  }, [gl])
  return null
}

export default function ShaderHero({
  uReducedMotion,
  onError,
}: {
  uReducedMotion: boolean
  onError?: () => void
}) {
  const [hasError, setHasError] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null!)

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  useEffect(() => {
    if (hasError) return
    const el = canvasRef.current?.querySelector('canvas')
    if (!el) return
    el.setAttribute('aria-hidden', 'true')
    el.setAttribute('role', 'presentation')
  }, [hasError])

  if (hasError) return null

  return (
    <div ref={canvasRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
        onError={(error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('[ShaderHero] compile failed:', error)
          }
          handleError()
        }}
      >
        <AdaptiveDpr pixelated />
        <FlowfieldScene
          reducedMotion={uReducedMotion}
          onCompileError={handleError}
        />
        <CanvasAriaSetter />
      </Canvas>
    </div>
  )
}
