import { paginationSchema } from '@/shared/validation'
import { z } from 'zod'
import { TICKET_STATUS } from './tickets.schema'

export const ticketIdSchema = z.object({
  id: z.coerce.number(),
})

export const createTicketSchema = z.object({
  formId: z.string(),
  summary: z.string(),
  form: z.unknown(), // Will be validated by the form validator
})

export const updateTicketSchema = z.object({
  summary: z.string().optional(),
  form: z.unknown().optional(),
  status: z.enum(Object.values(TICKET_STATUS)).optional(),
})

export const listTicketsSchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z
    .enum([...Object.values(TICKET_STATUS), 'all'])
    .optional()
    .transform((val) => (val === 'all' ? undefined : val)),
})
