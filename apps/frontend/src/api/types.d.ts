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
  form: Record<string, string>
  formOpen: boolean
}

export interface TicketWithUsers extends Ticket {
  reporter: EncryptedUser
  assignee: EncryptedUser | null
}

export interface TicketFilters {
  search: string
  status: string
  page: number
}

export interface TKForm {
  id: string
  name: string
  description: string
  disabled?: boolean
  elements: FormElement[]
}

export interface FormElement {
  id: string
  type: FormElementType
  name: string
  label?: string

  required?: boolean
  placeholder?: string
  options?: FormElementOption[]
  content?: string
}

export interface FormElementOption {
  id: string
  label: string
  value: string
}

export type FormElementType = 'text-field' | 'textarea' | 'dropdown' | 'text-panel'
