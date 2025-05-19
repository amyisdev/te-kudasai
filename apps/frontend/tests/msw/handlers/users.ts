import { http, HttpResponse } from 'msw'

const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    banned: false,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    banned: false,
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'user',
    banned: false,
    createdAt: '2024-01-03T00:00:00.000Z',
  },
]

export const listUsers = http.get('/api/users', ({ request }) => {
  const url = new URL(request.url)
  const search = url.searchParams.get('search') || ''
  const role = url.searchParams.get('role') || 'all'
  const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
  const limit = 10

  let filteredUsers = users

  if (search) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (role !== 'all') {
    filteredUsers = filteredUsers.filter((user) => user.role === role)
  }

  const total = filteredUsers.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const end = start + limit

  return HttpResponse.json({
    data: filteredUsers.slice(start, end),
    meta: {
      pagination: {
        total,
        totalPages,
        limit,
        page,
      },
    },
  })
})

export const setRole = http.post('http://localhost:3000/api/auth/admin/set-role', async ({ request }) => {
  const body = (await request.json()) as { userId: string; role: string }
  const user = users.find((u) => u.id === body.userId)
  if (!user) {
    return HttpResponse.json({ error: 'User not found' }, { status: 404 })
  }
  user.role = body.role
  return HttpResponse.json({ user })
})

export const banUser = http.post('http://localhost:3000/api/auth/admin/ban-user', async ({ request }) => {
  const body = (await request.json()) as { userId: string }
  const user = users.find((u) => u.id === body.userId)
  if (!user) {
    return HttpResponse.json({ error: 'User not found' }, { status: 404 })
  }
  user.banned = true
  return HttpResponse.json({ user })
})

export const unbanUser = http.post('http://localhost:3000/api/auth/admin/unban-user', async ({ request }) => {
  const body = (await request.json()) as { userId: string }
  const user = users.find((u) => u.id === body.userId)
  if (!user) {
    return HttpResponse.json({ error: 'User not found' }, { status: 404 })
  }
  user.banned = false
  return HttpResponse.json({ user })
})

export const usersHandlers = [listUsers, setRole, banUser, unbanUser]
