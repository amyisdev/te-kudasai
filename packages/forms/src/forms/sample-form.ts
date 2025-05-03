import { z } from 'zod'
import { Code } from 'lucide-react'

export const id = 'sample-form'
export const name = 'Sample Form'
export const description = 'Create a sample ticket'
export const validator = z.object({
  NAME: z.string().min(1),
  EMAIL: z.string().email().min(1),
})
export const icon = Code
