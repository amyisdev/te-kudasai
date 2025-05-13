import { db } from '@/db/client'
import app from '@/index'
import { TICKET_STATUS, ticketLogsTable, ticketsTable } from '@/tickets/tickets.schema'
import { desc, eq } from 'drizzle-orm'
import { signedInAs } from 'tests/utils/auth'
import { describe, expect, it } from 'vitest'

describe('Admin: List all tickets', () => {
  it('should list all tickets ordered descending by id', async () => {
    const res = await app.request('/api/tickets?status=all', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      status: 'success',
      meta: {
        pagination: {
          page: 1,
          limit: 10,
          total: expect.any(Number),
          totalPages: expect.any(Number),
        },
      },
    })

    expect(body.data[0]).toMatchObject({
      id: 5,
      reporterId: 'jane.doe',
      summary: 'Feature Request',
      status: 'open',
      formId: 'sample-form',
      formResponse: {
        'sample-text-field': 'Jane Doe',
      },
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })

  it('should return 404 when not admin', async () => {
    const res = await app.request('/api/tickets', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(404)
  })

  it('should filter tickets by search term', async () => {
    const res = await app.request('/api/tickets?search=Feature', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(2)
    expect(body.data[0].summary).toContain('Feature')
    expect(body.meta.pagination.total).toBe(2)
  })

  it('should filter tickets by status', async () => {
    const res = await app.request('/api/tickets?status=open', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(2)
    expect(body.data[0].status).toBe('open')
    expect(body.meta.pagination.total).toBe(2)
  })

  it('should return 400 when invalid status', async () => {
    const res = await app.request('/api/tickets?status=invalid', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(400)
  })

  it('should filter tickets by both search and status', async () => {
    const res = await app.request('/api/tickets?search=Feature&status=open', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].summary).toContain('Feature')
    expect(body.data[0].status).toBe('open')
    expect(body.meta.pagination.total).toBe(1)
  })
})

describe('Admin: Get ticket by id', () => {
  it('should get ticket by id', async () => {
    const res = await app.request('/api/tickets/1', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      status: 'success',
      data: expect.objectContaining({ id: 1 }),
    })

    const ticket = body.data
    expect(ticket).toMatchObject({
      reporter: expect.objectContaining({ name: 'John Doe' }),
    })
  })

  it('should get ticket by id (assigned)', async () => {
    const res = await app.request('/api/tickets/2', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      status: 'success',
      data: expect.objectContaining({ id: 2 }),
    })

    const ticket = body.data
    expect(ticket).toMatchObject({
      assignee: expect.objectContaining({ name: 'Admin' }),
    })
  })

  it('should return 404 when ticket not found', async () => {
    const res = await app.request('/api/tickets/999', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toEqual({
      status: 'error',
      message: 'Ticket not found',
      code: 'NOT_FOUND',
    })
  })
})

describe('Admin: Update ticket', () => {
  it('should update ticket', async () => {
    const res = await app.request('/api/tickets/1', {
      method: 'PATCH',
      headers: {
        ...(await signedInAs('admin@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: TICKET_STATUS.IN_PROGRESS,
        assigneeId: 'admin', // Should not update this field
      }),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      status: 'success',
      data: expect.objectContaining({
        id: 1,
        status: TICKET_STATUS.IN_PROGRESS,
        assigneeId: null,
        updatedAt: expect.any(String),
      }),
    })

    // Check ticket log
    const [log] = await db
      .select()
      .from(ticketLogsTable)
      .where(eq(ticketLogsTable.ticketId, 1))
      .orderBy(desc(ticketLogsTable.id))
      .limit(1)

    expect(log.userId).toBe('admin')
    expect(log.actionType).toBe('update')
  })

  it('should set openForm to false after ticket updated', async () => {
    await db.update(ticketsTable).set({ formOpen: true }).where(eq(ticketsTable.id, 1))

    const res = await app.request('/api/tickets/1', {
      method: 'PATCH',
      headers: {
        ...(await signedInAs('admin@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: TICKET_STATUS.IN_PROGRESS,
      }),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      status: 'success',
      data: expect.objectContaining({
        id: 1,
        status: TICKET_STATUS.IN_PROGRESS,
        formOpen: false,
        updatedAt: expect.any(String),
      }),
    })

    // Check ticket log
    const [log] = await db
      .select()
      .from(ticketLogsTable)
      .where(eq(ticketLogsTable.ticketId, 1))
      .orderBy(desc(ticketLogsTable.id))
      .limit(1)

    expect(log.userId).toBe('admin')
    expect(log.actionType).toBe('update')
  })

  it('should return 404 when ticket not found', async () => {
    const res = await app.request('/api/tickets/999', {
      method: 'PATCH',
      headers: {
        ...(await signedInAs('admin@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: TICKET_STATUS.IN_PROGRESS,
      }),
    })

    expect(res.status).toBe(404)
  })

  it('should return 400 when invalid status', async () => {
    const res = await app.request('/api/tickets/1', {
      method: 'PATCH',
      headers: {
        ...(await signedInAs('admin@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'invalid-status',
      }),
    })

    expect(res.status).toBe(400)
  })
})

describe('Admin: Delete ticket', () => {
  it('should delete ticket', async () => {
    const res = await app.request('/api/tickets/2', {
      method: 'DELETE',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({
      status: 'success',
      data: expect.objectContaining({
        id: 2,
      }),
    })

    // Cleanup: readd the ticket
    await db.insert(ticketsTable).values({
      id: 2,
      reporterId: 'john.doe',
      assigneeId: 'admin',
      summary: 'Account Suspension',
      status: TICKET_STATUS.RESOLVED,
      formId: 'sample-form',
      formResponse: {
        'sample-text-field': 'John Doe',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  })

  it('should return 404 when ticket not found', async () => {
    const res = await app.request('/api/tickets/999', {
      method: 'DELETE',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(404)
  })
})

describe('Admin: Toggle ticket assignment', () => {
  it('should assign the ticket to the current admin if unassigned', async () => {
    // Use unassigned ticket id
    const resAssign = await app.request('/api/tickets/1/assign-toggle', {
      method: 'POST',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(resAssign.status).toBe(200)

    const bodyAssign = await resAssign.json()
    expect(bodyAssign).toMatchObject({
      status: 'success',
      data: expect.objectContaining({
        id: 1,
        assigneeId: 'admin',
      }),
    })

    // Check ticket log
    const [log] = await db
      .select()
      .from(ticketLogsTable)
      .where(eq(ticketLogsTable.ticketId, 1))
      .orderBy(desc(ticketLogsTable.id))
      .limit(1)

    expect(log.userId).toBe('admin')
    expect(log.actionType).toBe('assign')

    // Cleanup
    await db.update(ticketsTable).set({ assigneeId: null }).where(eq(ticketsTable.id, 1))
  })

  it('should unassign the ticket if already assigned', async () => {
    // Use assigned ticket id
    const resUnassign = await app.request('/api/tickets/2/assign-toggle', {
      method: 'POST',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(resUnassign.status).toBe(200)

    const bodyUnassign = await resUnassign.json()
    expect(bodyUnassign).toMatchObject({
      status: 'success',
      data: expect.objectContaining({
        id: 2,
        assigneeId: null,
      }),
    })

    // Check ticket log
    const [log] = await db
      .select()
      .from(ticketLogsTable)
      .where(eq(ticketLogsTable.ticketId, 2))
      .orderBy(desc(ticketLogsTable.id))
      .limit(1)

    expect(log.userId).toBe('admin')
    expect(log.actionType).toBe('unassign')

    // Cleanup
    await db.update(ticketsTable).set({ assigneeId: 'admin' }).where(eq(ticketsTable.id, 2))
  })

  it('should return 404 when ticket not found', async () => {
    const res = await app.request('/api/tickets/9999/assign-toggle', {
      method: 'POST',
      headers: await signedInAs('admin@tk.local'),
    })
    expect(res.status).toBe(404)
  })
})

describe('Admin: Open ticket form', () => {
  it('should open the ticket form for a given ticket', async () => {
    // Ensure ticket 1 exists and formOpen is false
    await db.update(ticketsTable).set({ formOpen: false }).where(eq(ticketsTable.id, 1))

    const res = await app.request('/api/tickets/1/open-form', {
      method: 'POST',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      status: 'success',
      data: expect.objectContaining({ id: 1, formOpen: true }),
    })

    // Check ticket log
    const [log] = await db
      .select()
      .from(ticketLogsTable)
      .where(eq(ticketLogsTable.ticketId, 1))
      .orderBy(desc(ticketLogsTable.id))
      .limit(1)

    expect(log.userId).toBe('admin')
    expect(log.actionType).toBe('open_form')

    // Cleanup
    await db.update(ticketsTable).set({ formOpen: false }).where(eq(ticketsTable.id, 1))
  })

  it('should return 404 when ticket not found', async () => {
    const res = await app.request('/api/tickets/9999/open-form', {
      method: 'POST',
      headers: await signedInAs('admin@tk.local'),
    })
    expect(res.status).toBe(404)
  })
})
