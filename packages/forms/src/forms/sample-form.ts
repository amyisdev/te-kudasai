import { z } from 'zod'

export const id = 'sample-form'
export const name = 'Sample Form'
export const validator = z.object({
  NAME: z.string().min(1),
  EMAIL: z.string().email().min(1),
})
