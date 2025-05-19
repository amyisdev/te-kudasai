import app from '@/index'
import { signedInAs } from 'tests/utils/auth'
import { describe, expect, it } from 'vitest'

describe('List users', () => {
  it('should list all users when admin', async () => {
    const res = await app.request('/api/users?page=1', {
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
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          name: expect.any(String),
          role: expect.any(String),
        }),
      ]),
    })

    // Should be decrypted
    expect(body.data[0].name).toEqual('Admin')
    expect(body.data[0].email).toEqual('admin@tk.local')
  })

  it('should filter users by role', async () => {
    const res = await app.request('/api/users?page=1&role=user', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(2)
    expect(body.meta.pagination.total).toBe(2)
  })

  it('should filter users by full email', async () => {
    const res = await app.request('/api/users?page=1&search=john.doe@tk.local', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.meta.pagination.total).toBe(1)
  })

  it('should return 401 when not signed in', async () => {
    const res = await app.request('/api/users')
    expect(res.status).toBe(401)
  })

  it('should paginate results', async () => {
    const res = await app.request('/api/users?page=1&limit=2', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(2)
    expect(body.meta.pagination).toMatchObject({
      page: 1,
      limit: 2,
      total: expect.any(Number),
      totalPages: expect.any(Number),
    })
  })

  it('should return 400 when pagination params are invalid', async () => {
    const res = await app.request('/api/users?page=0&limit=0', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(400)
  })
})
