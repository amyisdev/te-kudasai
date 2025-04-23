import { users } from '@/auth/auth.schema'
import { index, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
  CLOSED: 'closed',
  RESOLVED: 'resolved',
} as const

export const ticketsTable = pgTable(
  'tickets',
  {
    id: serial('id').primaryKey(),

    reporterId: text('reporter_id')
      .notNull()
      .references(() => users.id),
    assigneeId: text('assignee_id').references(() => users.id),

    title: text('title').notNull(),
    description: text('description').notNull(),
    status: text('status')
      .notNull()
      .$default(() => TICKET_STATUS.OPEN),

    formId: text('form_id').notNull(),
    form: jsonb('form').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [
    index('reporter_id_idx').on(t.reporterId),
    index('assignee_id_idx').on(t.assigneeId),
    index('form_id_idx').on(t.formId),
  ],
)
