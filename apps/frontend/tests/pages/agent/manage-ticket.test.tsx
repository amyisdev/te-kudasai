import App from '@/App'
import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { authenticatedAgent } from '../../msw/handlers/auth'
import {
  getTicketAssigned,
  getTicketFormOpen,
  getTicketNotFound,
  openFormFailed,
  toggleAssignmentFailed,
  updateTicketFailed,
} from '../../msw/handlers/tickets'
import { server } from '../../msw/server'
import { renderWithRouter } from '../../utils'

describe('Manage Ticket', () => {
  beforeEach(() => server.use(authenticatedAgent))

  it('should render ticket detail', async () => {
    renderWithRouter(<App />, { route: '/agent/tickets/1' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Manage Ticket' })).toBeInTheDocument()
      expect(screen.getByText('Ticket #1')).toBeInTheDocument()
    })

    expect(screen.getByText('Test Ticket')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('should render ticket detail when ticket is assigned', async () => {
    server.use(getTicketAssigned)

    renderWithRouter(<App />, { route: '/agent/tickets/2' })

    await screen.findByText('Ticket #2')
    expect(screen.getByText('assigned-to-agent')).toBeInTheDocument()
  })

  it('should render empty state when ticket is not found', async () => {
    server.use(getTicketNotFound)

    renderWithRouter(<App />, { route: '/agent/tickets/3' })

    await screen.findByRole('heading', { level: 1, name: 'Manage Ticket' })
    await waitFor(() => {
      expect(screen.getByText('Ticket not found')).toBeInTheDocument()
    })
  })

  it('should allow agent to update ticket status', async () => {
    const { user } = renderWithRouter(<App />, { route: '/agent/tickets/1' })

    const statusSelect = await screen.findByLabelText('Status')
    await user.click(statusSelect)
    await user.click(screen.getByRole('option', { name: 'Resolved' }))

    await waitFor(() => {
      expect(screen.getByText('Ticket status has been updated to resolved')).toBeInTheDocument()
    })
  })

  it('should display error message when updating ticket status fails', async () => {
    server.use(updateTicketFailed)

    const { user } = renderWithRouter(<App />, { route: '/agent/tickets/1' })

    const statusSelect = await screen.findByLabelText('Status')
    await user.click(statusSelect)
    await user.click(screen.getByRole('option', { name: 'Resolved' }))

    await waitFor(() => {
      expect(screen.getByText('Unknown error')).toBeInTheDocument()
    })
  })

  it('should allow agent to toggle ticket assignment', async () => {
    const { user } = renderWithRouter(<App />, { route: '/agent/tickets/1' })

    const assignmentButton = await screen.findByText('Assign to me')
    await user.click(assignmentButton)

    await waitFor(() => {
      expect(screen.getByText('Ticket assignment has been updated')).toBeInTheDocument()
    })
  })

  it('should display error message when toggling ticket assignment fails', async () => {
    server.use(toggleAssignmentFailed)

    const { user } = renderWithRouter(<App />, { route: '/agent/tickets/1' })

    const assignmentButton = await screen.findByText('Assign to me')
    await user.click(assignmentButton)

    await waitFor(() => {
      expect(screen.getByText('Unknown error')).toBeInTheDocument()
    })
  })

  it('should allow agent to open form for update', async () => {
    const { user } = renderWithRouter(<App />, { route: '/agent/tickets/1' })

    const assignmentButton = await screen.findByRole('button', { name: 'Open form for update' })
    await user.click(assignmentButton)

    await waitFor(() => {
      expect(screen.getByText('Ticket form has been opened')).toBeInTheDocument()
    })
  })

  it('should display error message when opening form for update fails', async () => {
    server.use(openFormFailed)

    const { user } = renderWithRouter(<App />, { route: '/agent/tickets/1' })

    const assignmentButton = await screen.findByRole('button', { name: 'Open form for update' })
    await user.click(assignmentButton)

    await waitFor(() => {
      expect(screen.getByText('Unknown error')).toBeInTheDocument()
    })
  })

  it('should allow agent to update form when form is open', async () => {
    server.use(getTicketFormOpen)

    const { user } = renderWithRouter(<App />, { route: '/agent/tickets/1' })

    await waitFor(() => {
      expect(screen.getByText('Update Form')).toBeInTheDocument()
    })

    const submit = await screen.findByRole('button', { name: 'Submit' })
    await user.click(submit)

    await waitFor(() => {
      expect(screen.getByText('Ticket has been updated')).toBeInTheDocument()
    })
  })
})
