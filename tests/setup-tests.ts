import { db } from '@/db/client'
import { migrate } from 'drizzle-orm/pglite/migrator'

export async function setupDatabase() {
  await migrate(db, {
    migrationsFolder: './drizzle/',
  })

  await db.execute(`
    -- DML for users table
    INSERT INTO "users" ("id", "name", "email", "email_verified", "role") VALUES
    ('admin', 'Admin', 'admin@idp.local', FALSE, 'admin'),
    ('john.doe', 'John Doe', 'john.doe@idp.local', FALSE, 'user'),
    ('jane.doe', 'Jane Doe', 'jane.doe@idp.local', FALSE, 'user');
  `)

  // Hashing is expensive >:(
  await db.execute(`
    -- DML for accounts table
    INSERT INTO "accounts" ("id", "account_id", "provider_id", "user_id", "password") VALUES
    ('KJLyP9f0qeDi10gp_IBn2', 'admin', 'credential', 'admin', 'da5587e7dd97c704c776914322eb8d8d:3c59aab3990d1c1d603563146c75fb7c8a0ff16ef9ca044ed7d512f3d25f53bc1412df7e1fadb0a485eb5a6d456fb3e2f201a695874e7583755ddae3470fe308'),
    ('qKrIiCnRYl5PDSvujFpc4', 'john.doe', 'credential', 'john.doe', 'da5587e7dd97c704c776914322eb8d8d:3c59aab3990d1c1d603563146c75fb7c8a0ff16ef9ca044ed7d512f3d25f53bc1412df7e1fadb0a485eb5a6d456fb3e2f201a695874e7583755ddae3470fe308'),
    ('bLW-0euCbNkNKNA_fgdhL', 'jane.doe', 'credential', 'jane.doe', 'da5587e7dd97c704c776914322eb8d8d:3c59aab3990d1c1d603563146c75fb7c8a0ff16ef9ca044ed7d512f3d25f53bc1412df7e1fadb0a485eb5a6d456fb3e2f201a695874e7583755ddae3470fe308');
  `)
}
