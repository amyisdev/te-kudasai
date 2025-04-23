import { db } from '@/db/client'
import { and, desc, eq } from 'drizzle-orm'
import { ticketsTable } from './tickets.schema'

export async function getMyTickets(userId: string) {
  return await db.select().from(ticketsTable).where(eq(ticketsTable.reporterId, userId)).orderBy(desc(ticketsTable.id))
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

export async function getAllTickets() {
  return await db.select().from(ticketsTable).orderBy(desc(ticketsTable.id))
}

export async function getTicketById(ticketId: number) {
  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, ticketId))
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
