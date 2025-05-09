import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(25).default(10),
})

export type PaginationParams = z.infer<typeof paginationSchema>
