import { Hono } from 'hono'

const app = new Hono().get('/api/health', (c) => c.json({ status: 'success' }))

export default app
