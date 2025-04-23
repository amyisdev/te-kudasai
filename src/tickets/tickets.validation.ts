import { z } from 'zod'
import { TICKET_STATUS } from './tickets.schema'

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
  status: z
    .enum([
      TICKET_STATUS.OPEN,
      TICKET_STATUS.IN_PROGRESS,
      TICKET_STATUS.PENDING,
      TICKET_STATUS.CLOSED,
      TICKET_STATUS.RESOLVED,
    ])
    .optional(),
})
