// src/mocks/handlers.ts
import { handlers as authHandlers } from './auth'
import { handlers as formsHandlers } from './forms'
import { handlers as ticketsHandlers } from './tickets'
import { usersHandlers } from './users'

export const handlers = [...authHandlers, ...ticketsHandlers, ...formsHandlers, ...usersHandlers]
