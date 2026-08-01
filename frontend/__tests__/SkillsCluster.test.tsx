import { render, screen } from '@testing-library/react'
import SkillsCluster from '@/components/sections/skills-cluster'

const mockSkills = [
  { id: '1', name: 'React', category: 'Frontend', order_index: 0 },
  { id: '2', name: 'Python', category: 'Backend', order_index: 1 },
]

describe('SkillsCluster', () => {
  it('renders skills', () => {
    render(<SkillsCluster skills={mockSkills as any} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('renders nothing with empty skills', () => {
    const { container } = render(<SkillsCluster skills={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders heading', () => {
    render(<SkillsCluster skills={mockSkills as any} />)
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })
})
