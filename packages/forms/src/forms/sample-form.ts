import { Code } from 'lucide-react'
import type { FieldType } from '../types'

export const id = 'sample-form'
export const name = 'Sample Form'
export const description = 'Create a sample ticket'
export const icon = Code

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

    format: 'email',
  },
  {
    name: 'MESSAGE',
    label: 'Message',
    type: 'long-text',
    optional: true,
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
