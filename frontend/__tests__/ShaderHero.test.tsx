import { render } from '@testing-library/react'
import ShaderHero from '@/components/hero/shader-hero'

const mockCanvas = jest.fn()

jest.mock('@react-three/fiber', () => ({
  Canvas: (props: { children: React.ReactNode; onError?: (e: Error) => void; [key: string]: unknown }) => {
    mockCanvas(props)
    return <div data-testid="r3f-canvas">{props.children}</div>
  },
  useFrame: jest.fn(),
  useThree: () => ({
    size: { width: 1920, height: 1080 },
    gl: { domElement: document.createElement('canvas') },
    viewport: { width: 1920, height: 1080 },
  }),
}))

jest.mock('@react-three/drei', () => ({
  AdaptiveDpr: () => null,
}))

jest.mock('three', () => {
  const MockVector2 = jest.fn().mockImplementation((x, y) => ({ x, y, set: jest.fn() }))
  const MockCanvasTexture = jest.fn().mockImplementation(() => ({
    minFilter: 0,
    magFilter: 0,
    needsUpdate: false,
  }))
  return {
    Vector2: MockVector2,
    CanvasTexture: MockCanvasTexture,
    LinearFilter: 0,
  }
})

jest.mock('motion/react', () => ({
  useScroll: () => ({ scrollY: { on: jest.fn(() => () => {}) } }),
}))

jest.mock('@/components/hero/shaders/hero-flowfield.vert.glsl', () => '')
jest.mock('@/components/hero/shaders/hero-flowfield.frag.glsl', () => '')
jest.mock('@/components/hero/shaders/create-text-sdf', () => ({
  generateTextSDF: () => document.createElement('canvas'),
}))

describe('ShaderHero', () => {
  beforeEach(() => {
    mockCanvas.mockClear()
  })

  it('renders canvas container when no error', () => {
    const { container } = render(<ShaderHero uReducedMotion={false} />)
    const wrapper = container.querySelector('.absolute.inset-0')
    expect(wrapper).toBeInTheDocument()
  })

  it('returns null and calls onError on Canvas onError', () => {
    const onErrorSpy = jest.fn()
    mockCanvas.mockImplementationOnce((props: { onError?: (e: Error) => void }) => {
      props.onError?.(new Error('Shader compile error'))
      return <div data-testid="r3f-canvas" />
    })
    const { container } = render(<ShaderHero uReducedMotion={false} onError={onErrorSpy} />)
    expect(container.innerHTML).toBe('')
    expect(onErrorSpy).toHaveBeenCalledTimes(1)
  })

  it('renders normally when uReducedMotion is true', () => {
    const { container } = render(<ShaderHero uReducedMotion={true} />)
    const wrapper = container.querySelector('.absolute.inset-0')
    expect(wrapper).toBeInTheDocument()
  })
})