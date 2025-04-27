import type { Ticket } from '@/api/types'
import z from 'zod'

export const baseSchema = z.object({
  summary: z.string().min(1),
})

export const baseValues = {
  summary: '',
}

export interface BaseRenderProps {
  onSuccess?: (data: Ticket) => void
  onError?: (error: unknown) => void
}
