import { adminOnly, needAuth } from '@/auth/auth.middleware'
import forms from '@/forms'
import { BadRequestError, NotFoundError } from '@/shared/app-error'
import { paginatedResponse, successResponse } from '@/shared/response'
import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import * as service from './tickets.service'
import { createTicketSchema, listTicketsSchema, ticketIdSchema, updateTicketSchema } from './tickets.validation'

const ticketsRoutes = new Hono()

ticketsRoutes
  .use('*', needAuth)

  .get('/forms', (c) => {
    return c.json(
      successResponse(
        Object.values(forms).map((form) => ({
          id: form.id,
          name: form.name,
        })),
      ),
    )
  })

  .get('/my', sValidator('query', listTicketsSchema), async (c) => {
    const userId = c.var.user.id
    const pagination = c.req.valid('query')

    const { data, total } = await service.getMyTickets(userId, pagination)
    return c.json(paginatedResponse(data, { ...pagination, total }))
  })

  .post('/my', sValidator('json', createTicketSchema), async (c) => {
    const reporterId = c.var.user.id
    const data = c.req.valid('json')

    const form = forms[data.formId]
    if (!form) {
      throw new NotFoundError('Form not found')
    }

    const validatedForm = form.validator.safeParse(data.form)
    if (!validatedForm.success) {
      throw new BadRequestError('Invalid form data', 'INVALID_FORM_DATA')
    }

    const ticket = await service.createTicket({
      ...data,
      reporterId,
      form: validatedForm.data,
    })

    return c.json(successResponse(ticket))
  })

  .get('/my/:id', sValidator('param', ticketIdSchema), async (c) => {
    const userId = c.var.user.id
    const ticketId = c.req.valid('param').id
    const ticket = await service.getMyTicketById(userId, ticketId)
    if (!ticket) {
      throw new NotFoundError('Ticket not found')
    }

    return c.json(successResponse(ticket))
  })

  .use('*', adminOnly)

  .get('/', sValidator('query', listTicketsSchema), async (c) => {
    const pagination = c.req.valid('query')
    const { data, total } = await service.getAllTickets(pagination)
    return c.json(paginatedResponse(data, { ...pagination, total }))
  })

  .get('/:id', sValidator('param', ticketIdSchema), async (c) => {
    const ticketId = c.req.valid('param').id
    const ticket = await service.getTicketById(ticketId)
    if (!ticket) {
      throw new NotFoundError('Ticket not found')
    }
    return c.json(successResponse(ticket))
  })

  .patch('/:id', sValidator('param', ticketIdSchema), sValidator('json', updateTicketSchema), async (c) => {
    const ticketId = c.req.valid('param').id
    const data = c.req.valid('json')

    const existingTicket = await service.getTicketById(ticketId)
    if (!existingTicket) {
      throw new NotFoundError('Ticket not found')
    }

    const ticket = await service.updateTicket(ticketId, data)
    return c.json(successResponse(ticket))
  })

  .delete('/:id', sValidator('param', ticketIdSchema), async (c) => {
    const ticketId = c.req.valid('param').id

    const existingTicket = await service.getTicketById(ticketId)
    if (!existingTicket) {
      throw new NotFoundError('Ticket not found')
    }

    const ticket = await service.deleteTicket(ticketId)
    return c.json(successResponse(ticket))
  })

export default ticketsRoutes
