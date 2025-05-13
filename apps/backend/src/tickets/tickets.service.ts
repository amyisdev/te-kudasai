import { encryptedUsers } from '@/auth/auth.schema'
import { decryptUser } from '@/auth/auth.utils'
import { withPagination } from '@/db/builder-utils'
import { db } from '@/db/client'
import { formsTable } from '@/forms/forms.schema'
import type { PaginationParams } from '@/shared/validation'
import { type SQL, aliasedTable, and, count, desc, eq, ilike } from 'drizzle-orm'
import { TICKET_ACTION_TYPES, ticketLogsTable, ticketsTable } from './tickets.schema'

type ListTicketsParams = PaginationParams & {
  search?: string
  status?: string
}

export interface TicketAction {
  userId: string
  actionType: keyof typeof TICKET_ACTION_TYPES
  action: string
}

export async function getMyTickets(userId: string, { page = 1, limit = 10, search, status }: ListTicketsParams) {
  const conditions = [eq(ticketsTable.reporterId, userId)]

  if (search) {
    conditions.push(ilike(ticketsTable.summary, `%${search}%`))
  }

  if (status) {
    conditions.push(eq(ticketsTable.status, status))
  }

  const [{ total }] = await db
    .select({ total: count() })
    .from(ticketsTable)
    .where(and(...conditions))

  const query = db
    .select()
    .from(ticketsTable)
    .where(and(...conditions))
    .leftJoin(formsTable, eq(ticketsTable.formId, formsTable.id))

  const tickets = await withPagination(query.$dynamic(), desc(ticketsTable.id), page, limit)

  return {
    data: tickets.map((ticket) => ({ ...ticket.tickets, form: ticket.forms })),
    total,
  }
}

export async function getMyTicketById(userId: string, ticketId: number) {
  const [ticket] = await db
    .select()
    .from(ticketsTable)
    .leftJoin(formsTable, eq(ticketsTable.formId, formsTable.id))
    .where(and(eq(ticketsTable.id, ticketId), eq(ticketsTable.reporterId, userId)))

  return ticket
}

export async function createTicket(data: typeof ticketsTable.$inferInsert) {
  const ticket = await db.transaction(async (tx) => {
    const [ticket] = await tx.insert(ticketsTable).values(data).returning()

    await tx.insert(ticketLogsTable).values({
      ticketId: ticket.id,
      userId: data.reporterId,
      actionType: TICKET_ACTION_TYPES.CREATE,
      action: 'Ticket created',
    })

    return ticket
  })

  return ticket
}

export async function getAllTickets({ page = 1, limit = 10, search, status }: ListTicketsParams) {
  const conditions: SQL[] = []

  if (search) {
    conditions.push(ilike(ticketsTable.summary, `%${search}%`))
  }

  if (status) {
    conditions.push(eq(ticketsTable.status, status))
  }

  const [{ total }] = await db
    .select({ total: count() })
    .from(ticketsTable)
    .where(and(...conditions))

  const query = db
    .select()
    .from(ticketsTable)
    .where(and(...conditions))
    .leftJoin(formsTable, eq(ticketsTable.formId, formsTable.id))

  const tickets = await withPagination(query.$dynamic(), desc(ticketsTable.id), page, limit)

  return {
    data: tickets.map((ticket) => ({ ...ticket.tickets, form: ticket.forms })),
    total,
  }
}

export async function getTicketById(ticketId: number) {
  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, ticketId))
  return ticket
}

export async function getTicketByIdWithUsers(ticketId: number) {
  const assigneeTable = aliasedTable(encryptedUsers, 'assignee')
  const reporterTable = aliasedTable(encryptedUsers, 'reporter')

  const [ticket] = await db
    .select({
      tickets: ticketsTable,
      assignee: assigneeTable,
      reporter: reporterTable,
      forms: formsTable,
    })
    .from(ticketsTable)
    .where(eq(ticketsTable.id, ticketId))
    .leftJoin(assigneeTable, eq(ticketsTable.assigneeId, assigneeTable.userId))
    .leftJoin(reporterTable, eq(ticketsTable.reporterId, reporterTable.userId))
    .leftJoin(formsTable, eq(ticketsTable.formId, formsTable.id))
    .limit(1)

  if (ticket) {
    ticket.assignee = decryptUser(ticket.assignee)
    ticket.reporter = decryptUser(ticket.reporter)
  }

  return ticket
}

export async function updateTicket(
  ticketId: number,
  data: Partial<typeof ticketsTable.$inferInsert>,
  action: TicketAction,
) {
  const ticket = await db.transaction(async (tx) => {
    const [ticket] = await tx
      .update(ticketsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ticketsTable.id, ticketId))
      .returning()

    await tx.insert(ticketLogsTable).values({
      ticketId: ticket.id,
      userId: action.userId,
      actionType: TICKET_ACTION_TYPES[action.actionType],
      action: action.action,
    })

    return ticket
  })

  return ticket
}

export async function deleteTicket(ticketId: number) {
  const [ticket] = await db.delete(ticketsTable).where(eq(ticketsTable.id, ticketId)).returning()

  return ticket
}
