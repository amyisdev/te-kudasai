import { db } from '@/db/client'
import type { CreateFormSchema } from '@te-kudasai/forms'
import { type SQL, and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { formsTable } from './forms.schema'

interface ListFormParams {
  disabled?: boolean
}

export function listForms(params?: ListFormParams) {
  const conditions: SQL[] = []

  if (params?.disabled !== undefined) {
    conditions.push(eq(formsTable.disabled, params.disabled))
  }

  return db
    .select()
    .from(formsTable)
    .where(and(...conditions))
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
  const [form] = await db.select().from(formsTable).where(eq(formsTable.id, id))

  return form
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
