import App from '@/App'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createTicketFailed } from '../../msw/handlers/tickets'
import { server } from '../../msw/server'
import { renderWithRouter } from '../../utils'

describe('New Ticket Form', () => {
  it('should render the form', async () => {
    renderWithRouter(<App />, { route: '/new-ticket-form?type=sample-form' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Sample Form' })).toBeInTheDocument()
    })

    expect(screen.getByLabelText('Summary')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
    expect(screen.getByLabelText('Priority')).toBeInTheDocument()
  })

  it('should be able to create a ticket', async () => {
    const { user } = renderWithRouter(<App />, { route: '/new-ticket-form?type=sample-form' })

    const summary = await screen.findByLabelText('Summary')
    const name = await screen.findByLabelText('Name')
    const email = await screen.findByLabelText('Email')
    const message = await screen.findByLabelText('Message')
    const submitButton = await screen.findByRole('button', { name: 'Submit' })

    await user.type(summary, 'Test Summary')
    await user.type(name, 'Test Name')
    await user.type(email, 'test@example.com')
    await user.type(message, 'Test Message')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'View Ticket' })).toBeInTheDocument()
    })
  })

  it('should be able to handle errors', async () => {
    server.use(createTicketFailed)

    const { user } = renderWithRouter(<App />, { route: '/new-ticket-form?type=sample-form' })

    const summary = await screen.findByLabelText('Summary')
    const name = await screen.findByLabelText('Name')
    const email = await screen.findByLabelText('Email')
    const message = await screen.findByLabelText('Message')
    const submitButton = await screen.findByRole('button', { name: 'Submit' })

    await user.type(summary, 'Test Summary')
    await user.type(name, 'Test Name')
    await user.type(email, 'test@example.com')
    await user.type(message, 'Test Message')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid form data')).toBeInTheDocument()
    })
  })

  it('should redirect to new ticket when form is disabled', async () => {
    renderWithRouter(<App />, { route: '/new-ticket-form?type=disabled-form' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Create New Ticket' })).toBeInTheDocument()
    })
  })
})
