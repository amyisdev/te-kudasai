import App from '@/App'
import AllUsers from '@/pages/admin/all-users'
import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { authenticatedAgent } from '../../msw/handlers/auth'
import { server } from '../../msw/server'
import { renderWithRouter } from '../../utils'

describe('All Users', () => {
  beforeEach(() => server.use(authenticatedAgent))

  it('should render users list', async () => {
    renderWithRouter(<AllUsers />)
    expect(screen.getByRole('heading', { level: 1, name: 'All Users' })).toBeInTheDocument()

    // Check filter elements
    expect(screen.getByPlaceholderText('Search by full name or email...')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()

    // Check if users are rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })
  })

  it('should filter users by search', async () => {
    const { user } = renderWithRouter(<AllUsers />)
    const searchInput = screen.getByPlaceholderText('Search by full name or email...')

    await user.type(searchInput, 'john')

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })
  })

  it('should filter users by role', async () => {
    const { user } = renderWithRouter(<AllUsers />)

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Admin' }))

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })
  })

  it('should reset filters', async () => {
    const { user } = renderWithRouter(<AllUsers />)

    // Set some filters first
    const searchInput = screen.getByPlaceholderText('Search by full name or email...')
    await user.type(searchInput, 'john')

    // Reset filters
    await user.click(screen.getByRole('button', { name: 'Reset' }))

    await waitFor(() => {
      expect(searchInput).toHaveValue('')
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('should change user role', async () => {
    const { user } = renderWithRouter(<App />, { route: '/admin/users' })

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    // Open dropdown for Jane Smith
    const rows = screen.getAllByRole('row')
    const janeRow = rows.find((row) => row.textContent?.includes('Jane Smith'))
    const menuButton = janeRow?.querySelector('button')
    await user.click(menuButton!)

    // Click promote option
    await user.click(screen.getByText('Promote to Admin'))

    await waitFor(() => {
      expect(screen.getByText('User role updated to admin')).toBeInTheDocument()
    })

    await user.click(menuButton!)
    await user.click(screen.getByText('Demote to User'))

    await waitFor(() => {
      expect(screen.getByText('User role updated to user')).toBeInTheDocument()
    })
  })

  it('should ban and unban user', async () => {
    const { user } = renderWithRouter(<App />, { route: '/admin/users' })

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    // Open dropdown for Jane Smith
    const rows = screen.getAllByRole('row')
    const janeRow = rows.find((row) => row.textContent?.includes('Jane Smith'))
    const menuButton = janeRow?.querySelector('button')
    await user.click(menuButton!)

    // Ban user
    await user.click(screen.getByText('Ban User'))

    await waitFor(() => {
      expect(screen.getByText('Banned')).toBeInTheDocument()
    })

    // Unban user
    await user.click(menuButton!)
    await user.click(screen.getByText('Unban User'))

    await waitFor(() => {
      expect(screen.queryByText('Banned')).not.toBeInTheDocument()
    })
  })
})
