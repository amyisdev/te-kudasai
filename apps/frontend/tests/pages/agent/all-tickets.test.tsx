import App from '@/App'
import AllTickets from '@/pages/agent/all-tickets'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '../../utils'

describe('All Tickets', () => {
  it('should render tickets', async () => {
    renderWithRouter(<AllTickets />)
    expect(screen.getByRole('heading', { level: 1, name: 'All Tickets' })).toBeInTheDocument()

    expect(screen.getByPlaceholderText('Search by title...')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Bug Report')).toBeInTheDocument()
      expect(screen.getByText('Feature Request')).toBeInTheDocument()
      expect(screen.getByText('Support Request')).toBeInTheDocument()
    })
  })

  it('should redirect to home when user is not agent', async () => {
    renderWithRouter(<App />, { route: '/agent' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'My Tickets' })).toBeInTheDocument()
    })
  })
})
