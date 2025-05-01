import { auth } from '@/auth/better-auth'
import { NotFoundError, UnauthorizedError } from '@/shared/app-error'
import { createMiddleware } from 'hono/factory'

export const needAuth = createMiddleware<{
  Variables: {
    user: typeof auth.$Infer.Session.user
    session: typeof auth.$Infer.Session.session
  }
}>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) {
    throw new UnauthorizedError()
  }

  c.set('user', session.user)
  c.set('session', session.session)

  await next()
})

export const adminOnly = createMiddleware<{
  Variables: {
    user: typeof auth.$Infer.Session.user
  }
}>(async (c, next) => {
  if (!c.var.user) {
    throw new Error('needAuth must be used before adminOnly')
  }

  if (c.var.user.role !== 'admin') {
    // Fake not found error
    throw new NotFoundError()
  }

  await next()
})
