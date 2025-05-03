import App from '@/App'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { unauthenticated } from '../../msw/handlers/auth'
import { server } from '../../msw/server'
import { renderWithRouter } from '../../utils'

describe('Sign Out', () => {
  it('should render ticket detail', async () => {
    const { user } = renderWithRouter(<App />)

    const userMenu = await screen.findByRole('button', { name: 'User menu' })
    await user.click(userMenu)

    server.use(unauthenticated)
    const signOut = await screen.findByRole('menuitem', { name: 'Sign Out' })
    await user.click(signOut)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
    })
  })
})
