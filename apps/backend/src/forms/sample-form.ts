import { z } from 'zod'
import type { FormType } from './types'

export default {
  id: 'sample-form',
  name: 'Sample Form',
  validator: z.object({
    NAME: z.string().min(1),
    EMAIL: z.string().email().min(1),
  }),
} satisfies FormType
