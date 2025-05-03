import { decrypt } from '@/shared/crypto'
import type { encryptedUsers } from './auth.schema'

export function decryptUser(user?: typeof encryptedUsers.$inferSelect | null) {
  if (!user) {
    return null
  }

  return {
    ...user,
    name: decrypt(user.name),
    email: decrypt(user.email),
  }
}
