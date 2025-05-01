import type { z } from 'zod'
import type { BaseRenderProps } from './_base'

export interface FormType {
  id: string
  name: string
  validator: z.ZodObject
  render: <T extends BaseRenderProps>(props: T) => React.ReactNode
}
