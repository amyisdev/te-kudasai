import type { LucideIcon } from 'lucide-react'

interface BaseFieldType {
  name: string
  label: string

  optional?: boolean
}

interface TextFieldType extends BaseFieldType {
  type: 'text'
  format?: 'email'
}

interface LongTextFieldType extends BaseFieldType {
  type: 'long-text'
}

interface SelectFieldType extends BaseFieldType {
  type: 'select'
  options: { value: string; label: string }[]
}

export type FieldType = TextFieldType | LongTextFieldType | SelectFieldType

export interface FormType {
  id: string
  name: string
  description: string
  icon: LucideIcon
  fields: FieldType[]
  hasAutomation?: boolean
  disabled?: boolean
}
