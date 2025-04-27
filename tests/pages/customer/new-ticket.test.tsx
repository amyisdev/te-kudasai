import App from '@/App'
import NewTicket from '@/pages/customer/new-ticket'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createTicketFailed } from '../../msw/handlers/tickets'
import { server } from '../../msw/server'
import { renderWithRouter } from '../../utils'

describe('New Ticket', () => {
  it('should render the form', async () => {
    const { user } = renderWithRouter(<NewTicket />)
    expect(screen.getByRole('heading', { level: 1, name: 'Create New Ticket' })).toBeInTheDocument()

    const selectType = await screen.findByRole('combobox', { name: 'Ticket Type' })
    expect(selectType).toBeInTheDocument()

    await user.click(selectType)
    await user.click(screen.getByRole('option', { name: 'Sample Form' }))

    await waitFor(() => {
      expect(screen.getByLabelText('summary')).toBeInTheDocument()
      expect(screen.getByLabelText('name')).toBeInTheDocument()
      expect(screen.getByLabelText('email')).toBeInTheDocument()
    })
  })

  it('should be able to create a ticket', async () => {
    const { user } = renderWithRouter(<App />, { route: '/new-ticket' })

    const selectType = await screen.findByRole('combobox', { name: 'Ticket Type' })
    await user.click(selectType)
    await user.click(screen.getByRole('option', { name: 'Sample Form' }))

    const summary = await screen.findByLabelText('summary')
    const name = await screen.findByLabelText('name')
    const email = await screen.findByLabelText('email')
    const submitButton = await screen.findByRole('button', { name: 'Submit' })

    await user.type(summary, 'Test Summary')
    await user.type(name, 'Test Name')
    await user.type(email, 'test@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'View Ticket 1' })).toBeInTheDocument()
    })
  })

  it('should be able to handle errors', async () => {
    server.use(createTicketFailed)

    const { user } = renderWithRouter(<App />, { route: '/new-ticket' })

    const selectType = await screen.findByRole('combobox', { name: 'Ticket Type' })
    await user.click(selectType)
    await user.click(screen.getByRole('option', { name: 'Sample Form' }))

    const summary = await screen.findByLabelText('summary')
    const name = await screen.findByLabelText('name')
    const email = await screen.findByLabelText('email')
    const submitButton = await screen.findByRole('button', { name: 'Submit' })

    await user.type(summary, 'Test Summary')
    await user.type(name, 'Test Name')
    await user.type(email, 'test@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid form data')).toBeInTheDocument()
    })
  })
})
