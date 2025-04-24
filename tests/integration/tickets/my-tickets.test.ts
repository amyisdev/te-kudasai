import app from '@/index'
import { signedInAs } from 'tests/utils/auth'
import { describe, expect, it } from 'vitest'

describe('List my tickets', () => {
  it('should list my tickets', async () => {
    const res = await app.request('/api/tickets/my?page=1', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.data).toHaveLength(2)
    expect(body).toMatchObject({
      status: 'success',
      meta: {
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      },
      data: expect.arrayContaining([
        expect.objectContaining({
          id: 4,
          title: 'Bug Report',
        }),
      ]),
    })
  })

  it('should return 401 when not signed in', async () => {
    const res = await app.request('/api/tickets/my')
    expect(res.status).toBe(401)
  })

  it('should filter tickets by search term', async () => {
    const res = await app.request('/api/tickets/my?search=Feature', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].title).toContain('Feature')
    expect(body.meta.pagination.total).toBe(1)
  })

  it('should filter tickets by status', async () => {
    const res = await app.request('/api/tickets/my?status=open', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].status).toBe('open')
    expect(body.meta.pagination.total).toBe(1)
  })

  it('should return 400 when invalid status', async () => {
    const res = await app.request('/api/tickets/my?status=invalid', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(400)
  })

  it('should filter tickets by both search and status', async () => {
    const res = await app.request('/api/tickets/my?search=Bug&status=open', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(0)
    expect(body.meta.pagination.total).toBe(0)
  })
})

describe('Create ticket', () => {
  it('should create a new ticket', async () => {
    const res = await app.request('/api/tickets/my', {
      method: 'POST',
      headers: {
        ...(await signedInAs('jane.doe@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'New Ticket',
        description: 'New ticket description',
        formId: 'sample-form',
        form: {
          NAME: 'Jane Doe',
          EMAIL: 'jane.doe@tk.local',
        },
      }),
    })

    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toEqual({
      status: 'success',
      data: {
        id: expect.any(Number),
        reporterId: 'jane.doe',
        assigneeId: null,
        title: 'New Ticket',
        description: 'New ticket description',
        status: 'open',
        formId: 'sample-form',
        form: {
          NAME: 'Jane Doe',
          EMAIL: 'jane.doe@tk.local',
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    })
  })

  it('should return 404 when form not found', async () => {
    const res = await app.request('/api/tickets/my', {
      method: 'POST',
      headers: {
        ...(await signedInAs('jane.doe@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId: 'non-existent-form',
        title: 'New Ticket',
        description: 'New ticket description',
        form: {
          NAME: 'Jane Doe',
          EMAIL: 'jane.doe@tk.local',
        },
      }),
    })

    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toEqual({
      status: 'error',
      message: 'Form not found',
      code: 'NOT_FOUND',
    })
  })

  it('should return 400 when form data is invalid', async () => {
    const res = await app.request('/api/tickets/my', {
      method: 'POST',
      headers: {
        ...(await signedInAs('jane.doe@tk.local')),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId: 'sample-form',
        title: 'New Ticket',
        description: 'New ticket description',
        form: {
          NAME: 'Jane Doe',
          // missing EMAIL
        },
      }),
    })

    expect(res.status).toBe(400)
  })
})

describe('Get ticket by id', () => {
  it('should get my ticket by id', async () => {
    const res = await app.request('/api/tickets/my/4', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toEqual({
      status: 'success',
      data: expect.objectContaining({ id: 4 }),
    })
  })

  it('should return 404 when ticket not found', async () => {
    const res = await app.request('/api/tickets/my/999', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(404)
  })

  it('should return 404 when ticket belongs to another user', async () => {
    const res = await app.request('/api/tickets/my/1', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(404)
  })
})
