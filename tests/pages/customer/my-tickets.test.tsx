import MyTickets from '@/pages/customer/my-tickets'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { listMyTicketsEmpty } from '../../msw/handlers/tickets'
import { server } from '../../msw/server'
import { renderWithRouter } from '../../utils'

describe('My Tickets', () => {
  it('should render tickets', async () => {
    renderWithRouter(<MyTickets />)
    expect(screen.getByRole('heading', { level: 1, name: 'My Tickets' })).toBeInTheDocument()

    expect(screen.getByPlaceholderText('Search by title...')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Bug Report')).toBeInTheDocument()
      expect(screen.getByText('Feature Request')).toBeInTheDocument()
      expect(screen.getByText('Support Request')).toBeInTheDocument()
    })
  })

  it('should be able to filter tickets by title name', async () => {
    const { user } = renderWithRouter(<MyTickets />)

    const input = await screen.findByPlaceholderText('Search by title...')
    await user.type(input, 'Request')

    await waitFor(() => {
      expect(screen.queryByText('Bug Report')).not.toBeInTheDocument()
      expect(screen.getByText('Feature Request')).toBeInTheDocument()
    })

    const resetButton = await screen.findByRole('button', { name: 'Reset' })
    await user.click(resetButton)

    await waitFor(() => {
      expect(screen.queryByText('Bug Report')).toBeInTheDocument()
    })
  })

  it('should be able to filter tickets by status', async () => {
    const { user } = renderWithRouter(<MyTickets />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Open' }))

    await waitFor(() => {
      expect(screen.getByText('Bug Report')).toBeInTheDocument()
      expect(screen.queryByText('Feature Request')).not.toBeInTheDocument()
    })
  })

  it('should be able to display an empty state', async () => {
    server.use(listMyTicketsEmpty)

    renderWithRouter(<MyTickets />)

    await waitFor(() => {
      expect(screen.getByText('No tickets found'))
    })
  })
})
