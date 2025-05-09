import { db } from '@/db/client'
import { formsTable } from '@/forms/forms.schema'
import app from '@/index'
import { eq } from 'drizzle-orm'
import { signedInAs } from 'tests/utils/auth'
import { describe, expect, it } from 'vitest'

describe('Admin: Create form', () => {
  it('should create form', async () => {
    const res = await app.request('/api/forms', {
      method: 'POST',
      headers: {
        ...(await signedInAs('admin@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Form',
        description: 'This is a test form',
        elements: [
          {
            id: 'test-text-field',
            type: 'text-field',
            name: 'test-text-field',
            label: 'Test Text Field',
            required: true,
          },
        ],
      }),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.name).toBe('Test Form')
    expect(body.data.elements).toHaveLength(1)
    expect(body.data.elements[0].type).toBe('text-field')

    // cleanup
    const [testForm] = await db.select().from(formsTable).where(eq(formsTable.name, 'Test Form'))
    await db.delete(formsTable).where(eq(formsTable.id, testForm.id))
  })
})

describe('Admin: Update form', () => {
  it('should update form', async () => {
    const [sampleForm] = await db.select().from(formsTable).where(eq(formsTable.name, 'Sample Form'))

    const res = await app.request(`/api/forms/${sampleForm.id}`, {
      method: 'PATCH',
      headers: {
        ...(await signedInAs('admin@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Updated Test Form',
        description: 'This is an updated test form',
      }),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.name).toBe('Updated Test Form')
    expect(body.data.elements).toHaveLength(1)
    expect(body.data.elements[0].type).toBe('text-field')

    // cleanup
    await db
      .update(formsTable)
      .set({ name: 'Sample Form', description: 'This is a sample form' })
      .where(eq(formsTable.id, sampleForm.id))
  })

  it('should return 404 when form not found', async () => {
    const res = await app.request('/api/forms/999', {
      method: 'PATCH',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(404)
  })
})

describe('Admin: Delete form', () => {
  it('should delete form', async () => {
    const [newForm] = await db
      .insert(formsTable)
      .values({
        id: 'new-form',
        creatorId: 'admin',
        name: 'New Form',
        description: 'This is a new form',
        disabled: true,
        elements: [],
      })
      .returning()

    const res = await app.request(`/api/forms/${newForm.id}`, {
      method: 'DELETE',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.id).toBe(newForm.id)

    // make sure form is deleted
    const deletedForm = await db.select().from(formsTable).where(eq(formsTable.id, newForm.id))
    expect(deletedForm).toHaveLength(0)
  })

  it('should return 404 when form not found', async () => {
    const res = await app.request('/api/forms/999', {
      method: 'DELETE',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(404)
  })

  it('should return 400 when form is not disabled', async () => {
    const [sampleForm] = await db.select().from(formsTable).where(eq(formsTable.name, 'Sample Form'))

    const res = await app.request(`/api/forms/${sampleForm.id}`, {
      method: 'DELETE',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.code).toBe('FORM_NOT_DISABLED')
  })
})
