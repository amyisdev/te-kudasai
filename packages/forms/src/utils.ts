import { z } from 'zod'
import type { TKForm } from './types'

type NonEmptyArray<T> = [T, ...T[]]
type ValidZodString = z.ZodString | z.ZodOptional<z.ZodString>
type ValidZodEnum = z.ZodEnum<NonEmptyArray<string>> | z.ZodOptional<z.ZodEnum<NonEmptyArray<string>>>
type ValidZodSchema = ValidZodString | ValidZodEnum

export function generateZodSchema(tkForm: TKForm) {
  const formSchema: Record<string, ValidZodSchema> = {}

  for (const element of tkForm.elements) {
    switch (element.type) {
      case 'text-field':
      case 'textarea': {
        let schema: ValidZodString = z.string()
        if (element.type === 'text-field' && element.format === 'email') {
          schema = schema.email()
        }

        if (element.required) {
          schema = schema.min(1)
        } else {
          schema = schema.optional()
        }

        formSchema[element.name] = schema
        break
      }

      case 'dropdown': {
        formSchema[element.name] = z.enum(element.options.map((option) => option.value) as NonEmptyArray<string>)
        break
      }
    }
  }

  return z.object(formSchema)
}
