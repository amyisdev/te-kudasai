import type { Ticket, TicketWithUsers } from '@/api/types'
import { http, HttpResponse } from 'msw'

function ticketFactory(overrides: Partial<TicketWithUsers> = {}): TicketWithUsers {
  return {
    id: 1,
    summary: 'Test Ticket',
    status: 'open',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    formId: 'sample-form',
    form: { name: 'Jane Doe', message: 'Test Message', priority: 'high' },
    reporterId: 'jane.doe',
    assigneeId: null,
    formOpen: false,
    assignee: null,
    reporter: {
      id: 'jane.doe',
      userId: 'jane.doe',
      name: 'Jane Doe',
      email: 'jane.doe@tk.local',
    },
    ...overrides,
  }
}

const tickets = [
  ticketFactory({ id: 5, summary: 'Bug Report', status: 'open' }),
  ticketFactory({ id: 4, summary: 'Feature Request', status: 'in_progress' }),
  ticketFactory({ id: 3, summary: 'Support Request', status: 'resolved' }),
  ticketFactory({ id: 2, summary: 'Ticket 4', status: 'resolved' }),
  ticketFactory({ id: 1, summary: 'Ticket 5', status: 'resolved' }),
]

const perPage = 3

const filterTickets = (urlStr: string) => {
  const url = new URL(urlStr)
  const status = url.searchParams.get('status')
  const search = url.searchParams.get('search')
  const page = Number(url.searchParams.get('page') || 1)

  const filteredTickets = tickets.slice((page - 1) * perPage, page * perPage).filter((ticket) => {
    let matches = true
    if (status && status !== 'all') matches = ticket.status === status
    if (matches && search) matches = ticket.summary.includes(search)
    return matches
  })

  const totalPages = Math.ceil(tickets.length / perPage)

  return { filteredTickets, totalPages, page }
}

export const listMyTickets = http.get('http://localhost:3000/api/tickets/my', ({ request }) => {
  const { filteredTickets, totalPages, page } = filterTickets(request.url)

  return HttpResponse.json({
    data: filteredTickets,
    status: 'success',
    meta: { pagination: { total: filteredTickets.length, page, limit: perPage, totalPages } },
  })
})

export const listMyTicketsEmpty = http.get('http://localhost:3000/api/tickets/my', () => {
  return HttpResponse.json({
    data: [],
    status: 'success',
    meta: { pagination: { total: 0, page: 1, limit: perPage, totalPages: 1 } },
  })
})

export const createTicket = http.post('http://localhost:3000/api/tickets/my', async ({ request }) => {
  const body = (await request.json()) as Partial<Ticket>
  return HttpResponse.json({
    data: {
      ...ticketFactory(),
      ...body,
    },
    status: 'success',
  })
})

export const createTicketFailed = http.post('http://localhost:3000/api/tickets/my', () => {
  return HttpResponse.json(
    {
      code: 'INVALID_FORM_DATA',
      message: 'Invalid form data',
      status: 'error',
    },
    { status: 400 },
  )
})

export const getMyTicket = http.get('http://localhost:3000/api/tickets/my/:id', ({ params }) => {
  return HttpResponse.json({
    data: ticketFactory({ id: Number(params.id) }),
    status: 'success',
  })
})

export const getMyTicketNotFound = http.get('http://localhost:3000/api/tickets/my/:id', () => {
  return HttpResponse.json(
    {
      code: 'NOT_FOUND',
      message: 'Ticket not found',
      status: 'error',
    },
    { status: 404 },
  )
})

export const listAllTickets = http.get('http://localhost:3000/api/tickets', ({ request }) => {
  const { filteredTickets, totalPages, page } = filterTickets(request.url)

  return HttpResponse.json({
    data: filteredTickets,
    status: 'success',
    meta: { pagination: { total: filteredTickets.length, page, limit: perPage, totalPages } },
  })
})

export const getTicket = http.get('http://localhost:3000/api/tickets/:id', ({ params }) => {
  return HttpResponse.json({
    data: ticketFactory({ id: Number(params.id) }),
    status: 'success',
  })
})

export const getTicketAssigned = http.get('http://localhost:3000/api/tickets/:id', ({ params }) => {
  return HttpResponse.json({
    data: ticketFactory({
      id: Number(params.id),
      assigneeId: 'assigned-to-agent',
      assignee: {
        id: 'assigned-to-agent',
        userId: 'assigned-to-agent',
        name: 'Assigned Agent',
        email: 'assigned-to-agent@tk.local',
      },
    }),
    status: 'success',
  })
})

export const getTicketFormOpen = http.get('http://localhost:3000/api/tickets/:id', ({ params }) => {
  return HttpResponse.json({
    data: ticketFactory({ id: Number(params.id), formOpen: true }),
    status: 'success',
  })
})

export const getTicketNotFound = http.get('http://localhost:3000/api/tickets/:id', () => {
  return HttpResponse.json(
    {
      code: 'NOT_FOUND',
      message: 'Ticket not found',
      status: 'error',
    },
    { status: 404 },
  )
})

export const updateTicket = http.patch('http://localhost:3000/api/tickets/:id', async ({ params, request }) => {
  const body = (await request.json()) as Partial<Ticket>
  return HttpResponse.json({
    data: ticketFactory({ id: Number(params.id), ...body }),
    status: 'success',
  })
})

export const updateTicketFailed = http.patch('http://localhost:3000/api/tickets/:id', () => {
  return HttpResponse.json(
    {
      code: 'UNKNOWN_ERROR',
      message: 'Unknown error',
      status: 'error',
    },
    { status: 500 },
  )
})

export const toggleAssignment = http.post('http://localhost:3000/api/tickets/:id/assign-toggle', ({ params }) => {
  return HttpResponse.json({
    data: ticketFactory({ id: Number(params.id) }),
    status: 'success',
  })
})

export const toggleAssignmentFailed = http.post('http://localhost:3000/api/tickets/:id/assign-toggle', () => {
  return HttpResponse.json(
    {
      code: 'UNKNOWN_ERROR',
      message: 'Unknown error',
      status: 'error',
    },
    { status: 500 },
  )
})

export const openForm = http.post('http://localhost:3000/api/tickets/:id/open-form', ({ params }) => {
  return HttpResponse.json({
    data: ticketFactory({ id: Number(params.id), formOpen: true }),
    status: 'success',
  })
})

export const openFormFailed = http.post('http://localhost:3000/api/tickets/:id/open-form', () => {
  return HttpResponse.json(
    {
      code: 'UNKNOWN_ERROR',
      message: 'Unknown error',
      status: 'error',
    },
    { status: 500 },
  )
})

export const handlers = [
  listMyTickets,
  createTicket,
  getMyTicket,
  listAllTickets,
  getTicket,
  updateTicket,
  toggleAssignment,
  openForm,
]
