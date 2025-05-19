import { paginationSchema } from '@/shared/validation'
import { z } from 'zod'

export const listUsersSchema = paginationSchema.extend({
  search: z.string().optional(),
  role: z.enum(['all', 'user', 'admin']).optional().default('all'),
})
