import App from '@/App'
import FormList from '@/pages/agent/forms/form-list'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { authenticatedAgent } from '../../../msw/handlers/auth'
import { listFormsEmpty } from '../../../msw/handlers/forms'
import { server } from '../../../msw/server'
import { renderWithRouter } from '../../../utils'

describe('Form List', () => {
  it('should render form cards', async () => {
    renderWithRouter(<FormList />)

    await waitFor(() => {
      expect(screen.getByText('Sample Form')).toBeInTheDocument()
    })
  })

  it('should render empty state when no forms are available', async () => {
    server.use(listFormsEmpty)

    renderWithRouter(<FormList />)

    await waitFor(() => {
      expect(screen.getByText('No forms found')).toBeInTheDocument()
    })
  })

  it('should allow admin to toggle disable status of a form', async () => {
    server.use(authenticatedAgent)
    const { user } = renderWithRouter(<App />, { route: '/agent/forms' })

    await screen.findByText('Sample Form')

    const moreOptionsButton = await screen.findAllByRole('button', { name: 'More options' })
    await user.click(moreOptionsButton[0])

    const enableButton = await screen.findByRole('menuitem', { name: 'Enable' })
    await user.click(enableButton)

    await waitFor(() => {
      expect(screen.getByText('Form Disabled Form has been enabled')).toBeInTheDocument()
    })

    await user.click(moreOptionsButton[1])

    const disableButton = await screen.findByRole('menuitem', { name: 'Disable' })
    await user.click(disableButton)

    await waitFor(() => {
      expect(screen.getByText('Form Sample Form has been disabled')).toBeInTheDocument()
    })
  })

  it('should allow admin to delete disabled form', async () => {
    server.use(authenticatedAgent)
    const { user } = renderWithRouter(<App />, { route: '/agent/forms' })

    await screen.findByText('Disabled Form')

    const moreOptionsButton = await screen.findAllByRole('button', { name: 'More options' })
    await user.click(moreOptionsButton[0])

    const deleteButton = await screen.findByRole('menuitem', { name: 'Delete' })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('Form Disabled Form has been deleted')).toBeInTheDocument()
    })
  })
})
