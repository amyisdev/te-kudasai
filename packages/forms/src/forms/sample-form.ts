import { z } from 'zod'
import { Code } from 'lucide-react'
import type { FieldType } from '../types'

export const id = 'sample-form'
export const name = 'Sample Form'
export const description = 'Create a sample ticket'
export const icon = Code

export const validator = z.object({
  NAME: z.string().min(1),
  EMAIL: z.string().email().min(1),
  MESSAGE: z.string().min(1),
  PRIORITY: z.enum(['low', 'medium', 'high']),
})

export const fields = [
  {
    name: 'NAME',
    label: 'Name',
    type: 'text',
  },
  {
    name: 'EMAIL',
    label: 'Email',
    type: 'text',
  },
  {
    name: 'MESSAGE',
    label: 'Message',
    type: 'long-text',
  },
  {
    name: 'PRIORITY',
    label: 'Priority',
    type: 'select',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  },
] satisfies FieldType[]
