import { db } from '@/db/client'
import { migrate } from 'drizzle-orm/pglite/migrator'
import { beforeAll } from 'vitest'
import { seed } from './utils/seeder'

beforeAll(async () => {
  await migrate(db, {
    migrationsFolder: './drizzle/',
  })

  await seed()
})
