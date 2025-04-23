import { describe, it, expect } from 'vitest'
import { renderWithRouter } from '../utils'
import Home from '@/pages/home'
import { screen } from '@testing-library/react'

describe('Home', () => {
  it('should render', () => {
    renderWithRouter(<Home />)
    expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeInTheDocument()
  })
})
