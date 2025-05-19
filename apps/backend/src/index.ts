import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './auth/better-auth'
import usersRoutes from './auth/users/users.routes'
import formsRoutes from './forms/forms.routes'
import { NotFoundError, errorHandler } from './shared/app-error'
import { trustedOrigins } from './shared/env'
import ticketsRoutes from './tickets/tickets.routes'

const app = new Hono()
  .onError(errorHandler)
  .use('/api/*', cors({ origin: trustedOrigins, credentials: true }))
  .get('/api/health', (c) => c.json({ status: 'success' }))

  .on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

  .route('/api/tickets', ticketsRoutes)
  .route('/api/forms', formsRoutes)
  .route('/api/users', usersRoutes)

  .get('/api/*', (c) => {
    throw new NotFoundError('Page not found')
  })

export default app
