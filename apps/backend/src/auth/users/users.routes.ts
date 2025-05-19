import { paginatedResponse } from '@/shared/response'
import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import { adminOnly, needAuth } from '../auth.middleware'
import { getAllUsers } from './users.service'
import { listUsersSchema } from './users.validation'

const usersRoutes = new Hono()

usersRoutes.use('*', needAuth, adminOnly).get('/', sValidator('query', listUsersSchema), async (c) => {
  const pagination = c.req.valid('query')
  const { data, total } = await getAllUsers(pagination)
  return c.json(paginatedResponse(data, { ...pagination, total }))
})

export default usersRoutes
