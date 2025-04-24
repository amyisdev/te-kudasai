import { db } from '@/db/client'

const rawTickets = [
  {
    id: 1,
    reporterId: 'john.doe',
    assigneeId: null,
    title: 'Billing Issue',
    description: 'I am unable to pay for my subscription',
    status: 'open',
    formId: 'sample-form',
    form: '{ "NAME": "John Doe", "EMAIL": "john.doe@tk.local" }',
  },
  {
    id: 2,
    reporterId: 'john.doe',
    assigneeId: 'admin',
    title: 'Account Suspension',
    description: 'For some reason my account was suspended',
    status: 'resolved',
    formId: 'sample-form',
    form: '{ "NAME": "John Doe", "EMAIL": "john.doe@tk.local" }',
  },
  {
    id: 3,
    reporterId: 'john.doe',
    assigneeId: 'admin',
    title: 'Feature Request',
    description: 'I want to add a new feature to the app',
    status: 'in_progress',
    formId: 'sample-form',
    form: '{ "NAME": "John Doe", "EMAIL": "john.doe@tk.local" }',
  },
  {
    id: 4,
    reporterId: 'jane.doe',
    assigneeId: 'admin',
    title: 'Bug Report',
    description: 'Critical bug in production',
    status: 'in_progress',
    formId: 'sample-form',
    form: '{ "NAME": "Jane Doe", "EMAIL": "jane.doe@tk.local" }',
  },
  {
    id: 5,
    reporterId: 'jane.doe',
    assigneeId: null,
    title: 'Feature Request',
    description: 'New feature for better UX',
    status: 'open',
    formId: 'sample-form',
    form: '{ "NAME": "Jane Doe", "EMAIL": "jane.doe@tk.local" }',
  },
]

export async function seed() {
  await db.execute(`
    -- DML for users table
    INSERT INTO "users" ("id", "name", "email", "email_verified", "role") VALUES
    ('admin', 'Admin', 'admin@tk.local', FALSE, 'admin'),
    ('john.doe', 'John Doe', 'john.doe@tk.local', FALSE, 'user'),
    ('jane.doe', 'Jane Doe', 'jane.doe@tk.local', FALSE, 'user');
  `)

  // Hashing is expensive >:(
  await db.execute(`
    -- DML for accounts table
    INSERT INTO "accounts" ("id", "account_id", "provider_id", "user_id", "password") VALUES
    ('KJLyP9f0qeDi10gp_IBn2', 'admin', 'credential', 'admin', 'da5587e7dd97c704c776914322eb8d8d:3c59aab3990d1c1d603563146c75fb7c8a0ff16ef9ca044ed7d512f3d25f53bc1412df7e1fadb0a485eb5a6d456fb3e2f201a695874e7583755ddae3470fe308'),
    ('qKrIiCnRYl5PDSvujFpc4', 'john.doe', 'credential', 'john.doe', 'da5587e7dd97c704c776914322eb8d8d:3c59aab3990d1c1d603563146c75fb7c8a0ff16ef9ca044ed7d512f3d25f53bc1412df7e1fadb0a485eb5a6d456fb3e2f201a695874e7583755ddae3470fe308'),
    ('bLW-0euCbNkNKNA_fgdhL', 'jane.doe', 'credential', 'jane.doe', 'da5587e7dd97c704c776914322eb8d8d:3c59aab3990d1c1d603563146c75fb7c8a0ff16ef9ca044ed7d512f3d25f53bc1412df7e1fadb0a485eb5a6d456fb3e2f201a695874e7583755ddae3470fe308');
  `)

  await db.execute(`
    -- DML for tickets table
    INSERT INTO "tickets" ("id", "reporter_id", "assignee_id", "title", "description", "status", "form_id", "form") VALUES
    ${rawTickets.map((ticket) => `(${ticket.id}, '${ticket.reporterId}', ${ticket.assigneeId ? `'${ticket.assigneeId}'` : 'NULL'}, '${ticket.title}', '${ticket.description}', '${ticket.status}', '${ticket.formId}', '${ticket.form}')`).join(',')};
  `)

  await db.execute('ALTER SEQUENCE tickets_id_seq RESTART WITH 6')
}
