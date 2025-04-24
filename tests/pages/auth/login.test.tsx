import App from '@/App'
import { Login } from '@/pages/auth/login'
import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { authenticated, loginFailed, unauthenticated } from '../../msw/handlers/auth'
import { server } from '../../msw/server'
import { renderWithRouter } from '../../utils'

describe('Login', () => {
  beforeEach(() => {
    server.use(unauthenticated)
  })

  it('renders the login page', async () => {
    renderWithRouter(<Login />)

    expect(screen.getByRole('heading', { level: 1 }).textContent).toEqual('Login')
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('can login and redirect to my tickets', async () => {
    const { user } = renderWithRouter(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 }).textContent).toEqual('Login')
    })

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    server.use(authenticated)

    await user.type(emailInput, 'test@test.com')
    await user.type(passwordInput, 'password')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 }).textContent).toEqual('My Tickets')
    })
  })

  it('can show error when login fails', async () => {
    server.use(loginFailed)

    const { user } = renderWithRouter(<Login />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@test.com')
    await user.type(passwordInput, 'password')
    await user.click(loginButton)

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
  })

  it('redirects to my tickets when user is authenticated', async () => {
    server.use(authenticated)

    renderWithRouter(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 }).textContent).toEqual('My Tickets')
    })
  })
})
