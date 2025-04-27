import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import { BrowserRouter } from 'react-router'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <NuqsTestingAdapter>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </BrowserRouter>
    </NuqsTestingAdapter>
  )
}

export function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route)
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper }),
  }
}
