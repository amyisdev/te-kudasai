import type { TKForm } from '@te-kudasai/forms'

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

export interface EncryptedUser {
  id: string
  userId: string
  name: string
  email: string
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
  formResponse: Record<string, string>
  formOpen: boolean
}

export interface TicketForUser extends Ticket {
  form: TKForm
}

export interface TicketForAgent extends Ticket {
  reporter: EncryptedUser
  assignee: EncryptedUser | null
  form: TKForm
}

export interface TicketFilters {
  search: string
  status: string
  page: number
}
