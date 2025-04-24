// src/mocks/server.ts (Example for Vitest)
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
