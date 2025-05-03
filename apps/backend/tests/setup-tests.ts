import { db } from '@/db/client'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { beforeAll, vi } from 'vitest'
import { seed } from './utils/seeder'

beforeAll(async () => {
  vi.stubEnv('BETTER_AUTH_SECRET', 'testing-only-secret')

  await migrate(db, {
    migrationsFolder: './drizzle/',
  })

  await seed()
})
