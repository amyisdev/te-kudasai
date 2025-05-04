import { Code } from 'lucide-react'
import type { FieldType } from '../types'

export const id = 'disabled-form'
export const name = 'Disabled Form'
export const description = "This won't show up"
export const icon = Code
export const disabled = true

export const fields = [
  {
    name: 'NAME',
    label: 'Name',
    type: 'text',
  },
] satisfies FieldType[]
