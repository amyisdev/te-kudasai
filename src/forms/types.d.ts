import type { z } from 'zod'

export interface FormType {
  id: string
  name: string
  validator: z.ZodObject
}
