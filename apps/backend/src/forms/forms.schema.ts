import { users } from '@/auth/auth.schema'
import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const formsTable = pgTable('forms', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id),

  name: text('name').notNull(),
  description: text('description').notNull(),
  disabled: boolean('disabled').notNull().default(false),

  elements: jsonb('elements').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
