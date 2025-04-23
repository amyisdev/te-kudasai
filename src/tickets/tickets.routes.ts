import { adminOnly, needAuth } from '@/auth/auth.middleware'
import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import * as service from './tickets.service'
import { createTicketSchema, ticketIdSchema } from './tickets.validation'
import { BadRequestError, NotFoundError } from '@/shared/app-error'
import forms from '@/forms'
import z from 'zod'

const ticketsRoutes = new Hono()

ticketsRoutes
  .use('*', needAuth)

  .get('/forms', (c) => {
    return c.json(
      Object.values(forms).map((form) => ({
        id: form.id,
        name: form.name,
      })),
    )
  })

  .get('/my', async (c) => {
    const userId = c.var.user.id
    const tickets = await service.getMyTickets(userId)
    return c.json(tickets)
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

    return c.json(ticket)
  })

  .get('/my/:id', sValidator('param', ticketIdSchema), async (c) => {
    const userId = c.var.user.id
    const ticketId = c.req.valid('param').id
    const ticket = await service.getMyTicketById(userId, ticketId)
    if (!ticket) {
      throw new NotFoundError('Ticket not found')
    }

    return c.json(ticket)
  })

  .use('*', adminOnly)

  .get('/', (c) => {
    return c.json({ message: 'TODO: get all tickets' })
  })

  .get('/:id', (c) => {
    return c.json({ message: 'TODO: get ticket by id' })
  })

  .patch('/:id', (c) => {
    return c.json({ message: 'TODO: update ticket by id' })
  })

  .delete('/:id', (c) => {
    return c.json({ message: 'TODO: delete ticket by id' })
  })

export default ticketsRoutes
