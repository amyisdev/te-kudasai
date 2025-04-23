import { db } from '@/db/client'
import { and, eq } from 'drizzle-orm'
import { ticketsTable } from './tickets.schema'

export async function getMyTickets(userId: string) {
  return await db.select().from(ticketsTable).where(eq(ticketsTable.reporterId, userId))
}

export async function getMyTicketById(userId: string, ticketId: number) {
  const tickets = await db
    .select()
    .from(ticketsTable)
    .where(and(eq(ticketsTable.id, ticketId), eq(ticketsTable.reporterId, userId)))

  return tickets[0]
}

export async function createTicket(data: typeof ticketsTable.$inferInsert) {
  const [ticket] = await db.insert(ticketsTable).values(data).returning()

  return ticket
}
