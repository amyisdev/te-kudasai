import { db } from '@/db/client'
import { ticketsTable } from '@/tickets/tickets.schema'
import type { CreateFormSchema } from '@te-kudasai/forms'
import { type SQL, and, eq, exists } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { formsTable } from './forms.schema'

interface ListFormParams {
  disabled?: boolean
}

export async function listForms(params?: ListFormParams) {
  const conditions: SQL[] = []

  if (params?.disabled !== undefined) {
    conditions.push(eq(formsTable.disabled, params.disabled))
  }

  const ticketQuery = db.select().from(ticketsTable).where(eq(ticketsTable.formId, formsTable.id))
  const forms = await db
    .select({
      forms: formsTable,
      hasTickets: exists(ticketQuery),
    })
    .from(formsTable)
    .where(and(...conditions))

  return forms.map((form) => ({ ...form.forms, hasTickets: form.hasTickets }))
}

export async function createForm(userId: string, data: CreateFormSchema) {
  const [newForm] = await db
    .insert(formsTable)
    .values({
      ...data,
      id: nanoid(),
      creatorId: userId,
    })
    .returning()

  return newForm
}

export async function getFormById(id: string) {
  const ticketQuery = db.select().from(ticketsTable).where(eq(ticketsTable.formId, id))

  const [form] = await db
    .select({
      forms: formsTable,
      hasTickets: exists(ticketQuery),
    })
    .from(formsTable)
    .where(eq(formsTable.id, id))

  return form ? { ...form.forms, hasTickets: form.hasTickets } : form
}

export async function updateForm(id: string, data: Partial<CreateFormSchema>) {
  const [form] = await db
    .update(formsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(formsTable.id, id))
    .returning()

  return form
}

export async function deleteForm(id: string) {
  const [form] = await db.delete(formsTable).where(eq(formsTable.id, id)).returning()

  return form
}
