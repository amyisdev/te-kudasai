import App from '@/App'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getMyTicketNotFound } from '../../msw/handlers/tickets'
import { server } from '../../msw/server'
import { renderWithRouter } from '../../utils'

describe('View Ticket', () => {
  it('should render ticket detail', async () => {
    renderWithRouter(<App />, { route: '/tickets/1' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'View Ticket' })).toBeInTheDocument()
      expect(screen.getByText('Ticket #1')).toBeInTheDocument()
      expect(screen.getByText('Test Ticket')).toBeInTheDocument()
    })
  })

  it('should render empty state when ticket is not found', async () => {
    server.use(getMyTicketNotFound)

    renderWithRouter(<App />, { route: '/tickets/2' })

    await screen.findByRole('heading', { level: 1, name: 'View Ticket' })
    await waitFor(() => {
      expect(screen.getByText('Ticket not found')).toBeInTheDocument()
    })
  })
})
