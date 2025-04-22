import { adminOnly } from '@/auth/auth.middleware'
import { describe, expect, it } from 'vitest'

describe('adminOnly', () => {
  it('should throw error when run without needAuth', async () => {
    await expect(() =>
      adminOnly(
        {
          var: {
            user: null,
          },
          // biome-ignore lint/suspicious/noExplicitAny:
        } as any,
        () => Promise.resolve(),
      ),
    ).rejects.toThrowError('needAuth')
  })
})
