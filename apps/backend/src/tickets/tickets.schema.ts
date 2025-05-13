import { users } from '@/auth/auth.schema'
import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
  CLOSED: 'closed',
  RESOLVED: 'resolved',
} as const

// Ticket action types based on current operations
export const TICKET_ACTION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  ASSIGN: 'assign',
  UNASSIGN: 'unassign',
  OPEN_FORM: 'open_form',
} as const

export const ticketsTable = pgTable(
  'tickets',
  {
    id: serial('id').primaryKey(),

    reporterId: text('reporter_id')
      .notNull()
      .references(() => users.id),
    assigneeId: text('assignee_id').references(() => users.id),

    summary: text('summary').notNull(),
    status: text('status')
      .notNull()
      .$default(() => TICKET_STATUS.OPEN),

    formOpen: boolean('form_open').notNull().default(false),
    formId: text('form_id').notNull(),
    formResponse: jsonb('form_response').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [
    index('reporter_id_idx').on(t.reporterId),
    index('assignee_id_idx').on(t.assigneeId),
    index('form_id_idx').on(t.formId),
  ],
)

export const ticketLogsTable = pgTable('ticket_logs', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id')
    .notNull()
    .references(() => ticketsTable.id),

  userId: text('user_id')
    .notNull()
    .references(() => users.id),

  action: text('action').notNull(),
  actionType: text('action_type')
    .notNull()
    .$default(() => TICKET_ACTION_TYPES.CREATE),

  createdAt: timestamp('created_at').notNull().defaultNow(),
})
