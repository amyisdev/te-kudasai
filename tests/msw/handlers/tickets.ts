import type { Ticket } from '@/api/types'
import { http, HttpResponse } from 'msw'

function ticketFactory(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: 1,
    title: 'Test Ticket',
    description: 'Test Description',
    status: 'open',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    formId: 'sample-form',
    form: { NAME: 'Jane Doe', EMAIL: 'jane.doe@tk.local' },
    reporterId: 'jane.doe',
    assigneeId: null,
    ...overrides,
  }
}

const tickets = [
  ticketFactory({ id: 5, title: 'Bug Report', status: 'open' }),
  ticketFactory({ id: 4, title: 'Feature Request', status: 'in_progress' }),
  ticketFactory({ id: 3, title: 'Support Request', status: 'resolved' }),
  ticketFactory({ id: 2, title: 'Ticket 4', status: 'resolved' }),
  ticketFactory({ id: 1, title: 'Ticket 5', status: 'resolved' }),
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
    if (matches && search) matches = ticket.title.includes(search)
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

export const handlers = [listMyTickets]
