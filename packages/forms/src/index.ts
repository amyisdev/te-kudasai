import type { LucideIcon } from 'lucide-react'
import type { z } from 'zod'
import * as sampleForm from './forms/sample-form'

export interface FormType {
  id: string
  name: string
  description: string
  icon: LucideIcon
  validator: z.ZodObject<z.ZodRawShape>
}

export default {
  'sample-form': sampleForm,
} as Record<string, FormType>
