import { encryptedUsers } from '@/auth/auth.schema'
import { decryptUser } from '@/auth/auth.utils'
import { withPagination } from '@/db/builder-utils'
import { db } from '@/db/client'
import type { PaginationParams } from '@/shared/validation'
import { type SQL, aliasedTable, and, count, desc, eq, ilike } from 'drizzle-orm'
import { ticketsTable } from './tickets.schema'

export async function getMyTickets(
  userId: string,
  { page = 1, limit = 10, search, status }: PaginationParams & { search?: string; status?: string },
) {
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

  return {
    data: await withPagination(query.$dynamic(), desc(ticketsTable.id), page, limit),
    total,
  }
}

export async function getMyTicketById(userId: string, ticketId: number) {
  const [ticket] = await db
    .select()
    .from(ticketsTable)
    .where(and(eq(ticketsTable.id, ticketId), eq(ticketsTable.reporterId, userId)))

  return ticket
}

export async function createTicket(data: typeof ticketsTable.$inferInsert) {
  const [ticket] = await db.insert(ticketsTable).values(data).returning()

  return ticket
}

export async function getAllTickets({
  page = 1,
  limit = 10,
  search,
  status,
}: PaginationParams & { search?: string; status?: string }) {
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

  return {
    data: await withPagination(query.$dynamic(), desc(ticketsTable.id), page, limit),
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
    })
    .from(ticketsTable)
    .where(eq(ticketsTable.id, ticketId))
    .leftJoin(assigneeTable, eq(ticketsTable.assigneeId, assigneeTable.userId))
    .leftJoin(reporterTable, eq(ticketsTable.reporterId, reporterTable.userId))
    .limit(1)

  if (ticket) {
    ticket.assignee = decryptUser(ticket.assignee)
    ticket.reporter = decryptUser(ticket.reporter)
  }

  return ticket
}

export async function updateTicket(ticketId: number, data: Partial<typeof ticketsTable.$inferInsert>) {
  const [ticket] = await db
    .update(ticketsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(ticketsTable.id, ticketId))
    .returning()

  return ticket
}

export async function deleteTicket(ticketId: number) {
  const [ticket] = await db.delete(ticketsTable).where(eq(ticketsTable.id, ticketId)).returning()
  return ticket
}
