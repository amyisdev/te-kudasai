export interface SuccessResponse<T> {
  status: 'success'
  data: T[]
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
  title: string
  description: string
  status: TicketStatus
  createdAt: string
  updatedAt: string

  formId: string
  form: unknown
}
