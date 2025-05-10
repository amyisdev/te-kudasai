import { db } from '@/db/client'
import { encrypt, hash } from '@/shared/crypto'
import { CreateFormSchema } from '@te-kudasai/forms'

const rawUsers = [
  {
    id: 'admin',
    name: 'Admin',
    email: 'admin@tk.local',
    role: 'admin',
  },
  {
    id: 'john.doe',
    name: 'John Doe',
    email: 'john.doe@tk.local',
    role: 'user',
  },
  {
    id: 'jane.doe',
    name: 'Jane Doe',
    email: 'jane.doe@tk.local',
    role: 'user',
  },
]

const rawTickets = [
  {
    id: 1,
    reporterId: 'john.doe',
    assigneeId: null,
    summary: 'Billing Issue',
    status: 'open',
    formId: 'sample-form',
    form: '{ "sample-text-field": "John Doe" }',
  },
  {
    id: 2,
    reporterId: 'john.doe',
    assigneeId: 'admin',
    summary: 'Account Suspension',
    status: 'resolved',
    formId: 'sample-form',
    form: '{ "sample-text-field": "John Doe" }',
  },
  {
    id: 3,
    reporterId: 'john.doe',
    assigneeId: 'admin',
    summary: 'Feature Request',
    status: 'in_progress',
    formId: 'sample-form',
    form: '{ "sample-text-field": "John Doe" }',
  },
  {
    id: 4,
    reporterId: 'jane.doe',
    assigneeId: 'admin',
    summary: 'Bug Report',
    status: 'in_progress',
    formId: 'sample-form',
    form: '{ "sample-text-field": "Jane Doe" }',
  },
  {
    id: 5,
    reporterId: 'jane.doe',
    assigneeId: null,
    summary: 'Feature Request',
    status: 'open',
    formId: 'sample-form',
    form: '{ "sample-text-field": "Jane Doe" }',
  },
]

const rawForms = [
  {
    id: 'sample-form',
    creatorId: 'admin',
    name: 'Sample Form',
    description: 'This is a sample form',
    disabled: false,
    elements: [
      {
        id: 'sample-text-field',
        type: 'text-field',
        name: 'sample-text-field',
        label: 'Sample Text Field',
        required: true,
      },
    ],
  },
  {
    id: 'disabled-form',
    creatorId: 'admin',
    name: 'Disabled Form',
    description: 'This is a disabled form',
    disabled: true,
    elements: [],
  },
]

export async function seed() {
  await db.execute(`
    -- DML for users table
    INSERT INTO "users" ("id", "name", "email", "email_verified", "role") VALUES
    ${rawUsers.map((user) => `('${user.id}', '${hash(user.name.toLowerCase())}', '${hash(user.email.toLowerCase())}@tk.local', FALSE, '${user.role}')`).join(',')};
  `)

  await db.execute(`
    -- DML for encrypted_users table
    INSERT INTO "encrypted_users" ("id", "user_id", "name", "email") VALUES
    ${rawUsers.map((user) => `('${user.id}', '${user.id}', '${encrypt(user.name)}', '${encrypt(user.email)}@tk.local')`).join(',')};
  `)

  // Hashing password is expensive >:(
  await db.execute(`
    -- DML for accounts table
    INSERT INTO "accounts" ("id", "account_id", "provider_id", "user_id", "password") VALUES
    ('KJLyP9f0qeDi10gp_IBn2', 'admin', 'credential', 'admin', 'da5587e7dd97c704c776914322eb8d8d:3c59aab3990d1c1d603563146c75fb7c8a0ff16ef9ca044ed7d512f3d25f53bc1412df7e1fadb0a485eb5a6d456fb3e2f201a695874e7583755ddae3470fe308'),
    ('qKrIiCnRYl5PDSvujFpc4', 'john.doe', 'credential', 'john.doe', 'da5587e7dd97c704c776914322eb8d8d:3c59aab3990d1c1d603563146c75fb7c8a0ff16ef9ca044ed7d512f3d25f53bc1412df7e1fadb0a485eb5a6d456fb3e2f201a695874e7583755ddae3470fe308'),
    ('bLW-0euCbNkNKNA_fgdhL', 'jane.doe', 'credential', 'jane.doe', 'da5587e7dd97c704c776914322eb8d8d:3c59aab3990d1c1d603563146c75fb7c8a0ff16ef9ca044ed7d512f3d25f53bc1412df7e1fadb0a485eb5a6d456fb3e2f201a695874e7583755ddae3470fe308');
  `)

  await db.execute(`
    -- DML for tickets table
    INSERT INTO "tickets" ("id", "reporter_id", "assignee_id", "summary", "status", "form_id", "form") VALUES
    ${rawTickets.map((ticket) => `(${ticket.id}, '${ticket.reporterId}', ${ticket.assigneeId ? `'${ticket.assigneeId}'` : 'NULL'}, '${ticket.summary}', '${ticket.status}', '${ticket.formId}', '${ticket.form}')`).join(',')};
  `)

  await db.execute('ALTER SEQUENCE tickets_id_seq RESTART WITH 6')

  await db.execute(`
    -- DML for forms table
    INSERT INTO "forms" ("id", "creator_id", "name", "description", "disabled", "elements") VALUES
    ${rawForms.map((form) => `('${form.id}', '${form.creatorId}', '${form.name}', '${form.description}', ${form.disabled}, '${JSON.stringify(form.elements)}')`).join(',')};
  `)
}
