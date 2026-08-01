import { render, screen } from '@testing-library/react'
import MagneticButton from '@/components/motion/magnetic-button'

describe('MagneticButton', () => {
  it('renders children', () => {
    render(<MagneticButton><button>Click</button></MagneticButton>)
    expect(screen.getByText('Click')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <MagneticButton className="custom-class"><button>Click</button></MagneticButton>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
