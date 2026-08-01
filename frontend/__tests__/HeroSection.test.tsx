import { render, screen } from '@testing-library/react'
import HeroContent from '@/components/hero/hero-content'

describe('HeroContent', () => {
  it('renders headline text', () => {
    render(<HeroContent />)
    expect(screen.getByText(/intersection of AI/)).toBeInTheDocument()
  })

  it('renders CTA links', () => {
    render(<HeroContent />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
})
