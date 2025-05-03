import App from '@/App'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../../utils'

describe('New Ticket', () => {
  it('should render ticket type list', async () => {
    const { user } = renderWithRouter(<App />, { route: '/new-ticket' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Create New Ticket' })).toBeInTheDocument()
    })

    const link = screen.getByRole('link', { name: 'Select Sample Form' })
    expect(link).toBeInTheDocument()

    await user.click(link)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Sample Form' })).toBeInTheDocument()
    })
  })
})
