import { hash } from '@/shared/crypto'
import type { Logger } from 'drizzle-orm/logger'

export const sqlite = require('better-sqlite3')(process.env.UNIQUE_LOGGER_PATH || ':memory:')

sqlite.exec(`CREATE TABLE IF NOT EXISTS sql_logs (
  id TEXT PRIMARY KEY,
  query TEXT,
  params TEXT,
  query_with_params TEXT
)`)

export class UniqueLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    try {
      const id = hash(query).toString()
      let queryWithParams = query
      for (const param of params) {
        if (typeof param === 'string') {
          queryWithParams = queryWithParams.replace(`$${params.indexOf(param) + 1}`, `'${param}'`)
        } else if (typeof param === 'number') {
          queryWithParams = queryWithParams.replace(`$${params.indexOf(param) + 1}`, param.toString())
        }
      }

      sqlite
        .prepare('INSERT INTO sql_logs (id, query, params, query_with_params) VALUES (?, ?, ?, ?)')
        .run(id, query, JSON.stringify(params), queryWithParams)
    } catch (error) {
      // Ignore errors
    }
  }
}
