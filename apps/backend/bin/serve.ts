import { serveStatic } from 'hono/bun'
import app from '../src/index.ts'

app
  .get('/assets/*', serveStatic({ root: './apps/backend/dist' }))
  .get('/favicon.ico', serveStatic({ path: './apps/backend/dist/favicon.ico' }))
  .get('*', serveStatic({ path: './apps/backend/dist/index.html' }))

export default app
