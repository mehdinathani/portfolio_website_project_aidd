import { render, screen } from '@testing-library/react'
import TiltCard from '@/components/motion/tilt-card'

describe('TiltCard', () => {
  it('renders children', () => {
    render(<TiltCard><div data-testid="child">Content</div></TiltCard>)
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<TiltCard className="tilt-class"><div>Content</div></TiltCard>)
    expect(container.firstChild).toHaveClass('tilt-class')
  })
})
