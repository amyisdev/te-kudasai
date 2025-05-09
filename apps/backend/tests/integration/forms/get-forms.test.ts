import app from '@/index'
import { signedInAs } from 'tests/utils/auth'
import { describe, expect, it } from 'vitest'

describe('List enabled forms', () => {
  it('should return only enabled forms', async () => {
    const res = await app.request('/api/forms/enabled', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].disabled).toBe(false)
  })
})

describe('Get enabled form', () => {
  it('should return enabled form', async () => {
    const res = await app.request('/api/forms/enabled/sample-form', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.disabled).toBe(false)
  })

  it('should return 404 when form not found', async () => {
    const res = await app.request('/api/forms/enabled/999', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(404)
  })

  it('should return 404 when form disabled', async () => {
    const res = await app.request('/api/forms/enabled/disabled-form', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(404)
  })
})

describe('Admin: List all forms', () => {
  it('should return all forms', async () => {
    const res = await app.request('/api/forms', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(2)
  })

  it('should return 404 when user is not admin', async () => {
    const res = await app.request('/api/forms', {
      headers: await signedInAs('jane.doe@tk.local'),
    })

    expect(res.status).toBe(404)
  })
})

describe('Admin: Get form', () => {
  it('should return form', async () => {
    const res = await app.request('/api/forms/disabled-form', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.disabled).toBe(true)
  })

  it('should return 404 when form not found', async () => {
    const res = await app.request('/api/forms/999', {
      headers: await signedInAs('admin@tk.local'),
    })

    expect(res.status).toBe(404)
  })
})
