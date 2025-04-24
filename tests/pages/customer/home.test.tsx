import Home from '@/pages/customer/home'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../../utils'

describe('Home', () => {
  it('should render', () => {
    renderWithRouter(<Home />)
    expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeInTheDocument()
  })
})
