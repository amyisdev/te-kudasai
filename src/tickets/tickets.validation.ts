import { z } from 'zod'

export const createTicketSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  formId: z.string().nonempty(),
  form: z.unknown(),
})

export type CreateTicketSchema = z.infer<typeof createTicketSchema>

export const ticketIdSchema = z.object({
  id: z.string().transform((val) => Number.parseInt(val)),
})
