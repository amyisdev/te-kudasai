import app from '@/index'
import { TICKET_STATUS } from '@/tickets/tickets.schema'
import { signedInAs } from 'tests/utils/auth'
import { describe, expect, it } from 'vitest'

describe('Admin: List all tickets', () => {
  it('should list all tickets', async () => {
    const res = await app.request('/api/tickets', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(3)

    expect(body[0]).toEqual({
      id: 3,
      reporterId: 'jane.doe',
      assigneeId: null,
      title: 'Ticket 3',
      description: 'Ticket 3 description',
      status: 'open',
      formId: 'sample-form',
      form: {
        NAME: 'Jane Doe',
        EMAIL: 'jane.doe@tk.local',
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

  it('should return 401 when not signed in', async () => {
    const res = await app.request('/api/tickets')
    expect(res.status).toBe(401)
  })
})

describe('Admin: Get ticket by id', () => {
  it('should get ticket by id', async () => {
    const res = await app.request('/api/tickets/1', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ id: 1 })
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
        assigneeId: 'admin',
      }),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      id: 1,
      status: TICKET_STATUS.IN_PROGRESS,
      assigneeId: 'admin',
    })
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
    expect(body).toMatchObject({ id: 2 })
  })

  it('should return 404 when ticket not found', async () => {
    const res = await app.request('/api/tickets/999', {
      method: 'DELETE',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(404)
  })
})
