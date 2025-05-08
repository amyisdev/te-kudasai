import { paginationSchema } from '@/shared/validation'
import { z } from 'zod'

export const ticketIdSchema = z.object({
  id: z.coerce.number(),
})

export const createTicketSchema = z.object({
  formId: z.string(),
  summary: z.string().min(1),
  form: z.unknown(), // Will be validated by the form validator
})

export const updateTicketSchema = z.object({
  summary: z.string().min(1).optional(),
  form: z.unknown().optional(),
  status: z.enum(['open', 'in_progress', 'pending', 'closed', 'resolved']).optional(),
})

export const listTicketsSchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z
    .enum(['open', 'in_progress', 'pending', 'closed', 'resolved', 'all'])
    .optional()
    .transform((val) => (val === 'all' ? undefined : val)),
})
