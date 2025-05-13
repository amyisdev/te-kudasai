import { UniqueLogger, sqlite } from '@/db/logger'
import { describe, expect, it } from 'vitest'

describe('UniqueLogger', () => {
  it('should log unique query', () => {
    const logger = new UniqueLogger()

    // should only log once
    logger.logQuery('SELECT * FROM users WHERE id = $1', [1])
    logger.logQuery('SELECT * FROM users WHERE id = $1', [2])
    logger.logQuery('SELECT * FROM users WHERE id = $1', ['3'])

    const logs = sqlite.prepare('SELECT * FROM sql_logs').all()
    expect(logs).toHaveLength(1)
  })
})
