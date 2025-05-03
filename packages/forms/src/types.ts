import type { LucideIcon } from 'lucide-react'
import type { z } from 'zod'

interface BaseFieldType {
  name: string
  label: string
}

interface TextFieldType extends BaseFieldType {
  type: 'text'
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
  validator: z.ZodObject<z.ZodRawShape>
  fields: FieldType[]
}
