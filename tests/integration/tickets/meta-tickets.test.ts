import app from '@/index'
import { signedInAs } from 'tests/utils/auth'
import { describe, expect, it } from 'vitest'

describe('List available forms', () => {
  it('should list available forms', async () => {
    const res = await app.request('/api/tickets/forms', {
      headers: await signedInAs('john.doe@tk.local'),
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([
      {
        id: 'sample-form',
        name: 'Sample Form',
      },
    ])
  })
})
