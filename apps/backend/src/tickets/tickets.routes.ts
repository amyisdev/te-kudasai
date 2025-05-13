import { adminOnly, needAuth } from '@/auth/auth.middleware'
import { getFormById } from '@/forms/forms.service'
import { BadRequestError, NotFoundError } from '@/shared/app-error'
import { paginatedResponse, successResponse } from '@/shared/response'
import { sValidator } from '@hono/standard-validator'
import { type TKForm, generateZodSchema } from '@te-kudasai/forms'
import { Hono } from 'hono'
import * as service from './tickets.service'
import { createTicketSchema, listTicketsSchema, ticketIdSchema, updateTicketSchema } from './tickets.validation'

const ticketsRoutes = new Hono()

ticketsRoutes
  .use('*', needAuth)

  .get('/my', sValidator('query', listTicketsSchema), async (c) => {
    const userId = c.var.user.id
    const pagination = c.req.valid('query')

    const { data, total } = await service.getMyTickets(userId, pagination)
    return c.json(paginatedResponse(data, { ...pagination, total }))
  })

  .post('/my', sValidator('json', createTicketSchema), async (c) => {
    const reporterId = c.var.user.id
    const data = c.req.valid('json')

    const form = await getFormById(data.formId)
    if (!form || form.disabled) {
      throw new NotFoundError('Form not found')
    }

    const validatedForm = generateZodSchema(form as TKForm).safeParse(data.formResponse)
    if (!validatedForm.success) {
      throw new BadRequestError('Invalid form data', 'INVALID_FORM_DATA')
    }

    const ticket = await service.createTicket({
      ...data,
      reporterId,
      formResponse: validatedForm.data,
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

    return c.json(successResponse({ ...ticket.tickets, form: ticket.forms }))
  })

  .use('*', adminOnly)

  .get('/', sValidator('query', listTicketsSchema), async (c) => {
    const pagination = c.req.valid('query')
    const { data, total } = await service.getAllTickets(pagination)
    return c.json(paginatedResponse(data, { ...pagination, total }))
  })

  .get('/:id', sValidator('param', ticketIdSchema), async (c) => {
    const ticketId = c.req.valid('param').id
    const ticket = await service.getTicketByIdWithUsers(ticketId)
    if (!ticket) {
      throw new NotFoundError('Ticket not found')
    }
    return c.json(
      successResponse({
        ...ticket.tickets,
        assignee: ticket.assignee,
        reporter: ticket.reporter,
        form: ticket.forms,
      }),
    )
  })

  .patch('/:id', sValidator('param', ticketIdSchema), sValidator('json', updateTicketSchema), async (c) => {
    const ticketId = c.req.valid('param').id
    const data = c.req.valid('json')

    const existingTicket = await service.getTicketById(ticketId)
    if (!existingTicket) {
      throw new NotFoundError('Ticket not found')
    }

    let action: service.TicketAction = {
      userId: c.var.user.id,
      actionType: 'UPDATE',
      action: 'Ticket updated',
    }

    if (data.status && data.status !== existingTicket.status) {
      action = {
        userId: c.var.user.id,
        actionType: 'UPDATE',
        action: `Ticket status updated from ${existingTicket.status} to ${data.status}`,
      }
    }

    const ticket = await service.updateTicket(ticketId, { ...data, formOpen: false }, action)

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

  .post('/:id/assign-toggle', sValidator('param', ticketIdSchema), async (c) => {
    const ticketId = c.req.valid('param').id
    const ticket = await service.getTicketById(ticketId)
    if (!ticket) {
      throw new NotFoundError('Ticket not found')
    }

    const isAssigned = ticket.assigneeId !== null

    const updatedTicket = await service.updateTicket(
      ticketId,
      {
        assigneeId: isAssigned ? null : c.var.user.id,
      },
      {
        userId: c.var.user.id,
        actionType: isAssigned ? 'UNASSIGN' : 'ASSIGN',
        action: isAssigned ? 'Ticket unassigned' : 'Ticket assigned',
      },
    )

    return c.json(successResponse(updatedTicket))
  })

  .post('/:id/open-form', sValidator('param', ticketIdSchema), async (c) => {
    const ticketId = c.req.valid('param').id
    const ticket = await service.getTicketById(ticketId)
    if (!ticket) {
      throw new NotFoundError('Ticket not found')
    }

    const updatedTicket = await service.updateTicket(
      ticketId,
      {
        formOpen: true,
      },
      {
        userId: c.var.user.id,
        actionType: 'OPEN_FORM',
        action: 'Ticket form opened',
      },
    )

    return c.json(successResponse(updatedTicket))
  })

export default ticketsRoutes
