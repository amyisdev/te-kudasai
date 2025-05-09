// src/mocks/handlers.ts
import { handlers as authHandlers } from './auth'
import { handlers as formsHandlers } from './forms'
import { handlers as ticketsHandlers } from './tickets'

export const handlers = [...authHandlers, ...ticketsHandlers, ...formsHandlers]
