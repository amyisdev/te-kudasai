import app from '@/index'
import { TICKET_STATUS } from '@/tickets/tickets.schema'
import { signedInAs } from 'tests/utils/auth'
import { describe, expect, it } from 'vitest'

describe('Admin: List all tickets', () => {
  it('should list all tickets ordered descending by id', async () => {
    const res = await app.request('/api/tickets', {
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
      assigneeId: null,
      title: 'Feature Request',
      description: 'New feature for better UX',
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

  it('should filter tickets by search term', async () => {
    const res = await app.request('/api/tickets?search=Feature', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(2)
    expect(body.data[0].title).toContain('Feature')
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
    expect(body.data[0].title).toContain('Feature')
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

  it('should return 404 when not admin', async () => {
    const res = await app.request('/api/tickets/1', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(404)
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
    expect(body).toEqual({
      status: 'success',
      data: expect.objectContaining({
        id: 1,
        status: TICKET_STATUS.IN_PROGRESS,
        assigneeId: 'admin',
        updatedAt: expect.any(String),
      }),
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

  it('should return 404 when not admin', async () => {
    const res = await app.request('/api/tickets/1', {
      method: 'PATCH',
      headers: {
        ...(await signedInAs('jane.doe@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: TICKET_STATUS.IN_PROGRESS,
      }),
    })

    expect(res.status).toBe(404)
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
  })

  it('should return 404 when ticket not found', async () => {
    const res = await app.request('/api/tickets/999', {
      method: 'DELETE',
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(404)
  })

  it('should return 404 when not admin', async () => {
    const res = await app.request('/api/tickets/1', {
      method: 'DELETE',
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(404)
  })
})
