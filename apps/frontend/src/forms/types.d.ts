import type { Ticket } from '@/api/types'
import type { FormType } from '@te-kudasai/forms'

export interface RenderProps {
  onSuccess?: (data: Ticket) => void
  onError?: (error: unknown) => void
  ticket?: Ticket
}

export interface FormTypeWithRender extends FormType {
  render: <T extends RenderProps>(props: T) => React.ReactNode
}
