import { z } from 'zod'
import { TICKET_STATUS } from './tickets.schema'
import { paginationSchema } from '@/shared/validation'

export const ticketIdSchema = z.object({
  id: z.coerce.number(),
})

export const createTicketSchema = z.object({
  formId: z.string(),
  title: z.string(),
  description: z.string(),
  form: z.unknown(), // Will be validated by the form validator
})

export const updateTicketSchema = z.object({
  assigneeId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(Object.values(TICKET_STATUS)).optional(),
})

export const listTicketsSchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z
    .enum([...Object.values(TICKET_STATUS), 'all'])
    .optional()
    .transform((val) => (val === 'all' ? undefined : val)),
})
