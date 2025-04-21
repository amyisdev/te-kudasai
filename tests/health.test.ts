import { describe, it, expect } from 'vitest'
import app from '@/index'

describe('Health Endpoint', () => {
  it('should return status ok', async () => {
    const response = await app.request('/api/health')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ status: 'success' })
  })
})
