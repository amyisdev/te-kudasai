import { withPagination } from '@/db/builder-utils'
import { db } from '@/db/client'
import { decrypt, hash } from '@/shared/crypto'
import type { PaginationParams } from '@/shared/validation'
import { type SQL, and, asc, count, eq, or } from 'drizzle-orm'
import { encryptedUsers, users as usersTable } from '../auth.schema'

type FilterUsersParams = PaginationParams & {
  role?: 'all' | 'user' | 'admin'
  search?: string
}

export async function getAllUsers({ page = 1, limit = 10, role = 'all', search }: FilterUsersParams) {
  const conditions: (SQL | undefined)[] = []
  if (search) {
    const hashedSearch = hash(search.toLowerCase())
    conditions.push(or(eq(usersTable.name, hashedSearch), eq(usersTable.email, `${hashedSearch}@tk.local`)))
  }

  if (role !== 'all') {
    conditions.push(eq(usersTable.role, role))
  }

  const [{ total }] = await db
    .select({ total: count() })
    .from(usersTable)
    .where(and(...conditions))

  const query = db
    .select()
    .from(usersTable)
    .leftJoin(encryptedUsers, eq(usersTable.id, encryptedUsers.userId))
    .where(and(...conditions))

  const users = await withPagination(query.$dynamic(), asc(usersTable.createdAt), page, limit)

  return {
    data: users.map((user) => ({
      ...user.users,
      email: user.encrypted_users ? decrypt(user.encrypted_users.email) : user.users.email,
      name: user.encrypted_users ? decrypt(user.encrypted_users.name) : user.users.name,
    })),
    total,
  }
}
