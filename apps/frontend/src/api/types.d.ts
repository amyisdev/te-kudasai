import type { User } from 'better-auth/types'

export interface SuccessResponse<T> {
  status: 'success'
  data: T
}

export interface PaginatedResponse<T> extends SuccessResponse<T> {
  meta: { pagination: Pagination }
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'

export interface Ticket {
  id: number
  reporterId: string
  assigneeId: string | null
  summary: string
  status: TicketStatus
  createdAt: string
  updatedAt: string

  formId: string
  form: Record<string, string>
  formOpen: boolean
}

export interface TicketWithUsers extends Ticket {
  reporter: User
  assignee: User | null
}

export interface TicketFilters {
  search: string
  status: string
  page: number
}
