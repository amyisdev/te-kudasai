import { z } from 'zod/v4'
import type { TKForm } from './types'

type ValidZodString = z.ZodString | z.ZodEmail
type ValidZodEnum = z.ZodEnum<Record<string, string>>
type ValidZodFile = z.ZodFile | z.ZodOptional<z.ZodFile>
type ValidZodSchema = ValidZodString | ValidZodEnum | ValidZodFile

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf', 'text/plain']

export function generateZodSchema(tkForm: TKForm) {
  const formSchema: Record<string, ValidZodSchema> = {}

  for (const element of tkForm.elements) {
    switch (element.type) {
      case 'text-field':
      case 'textarea': {
        let schema: ValidZodString = z.string()
        if (element.type === 'text-field' && element.format === 'email') {
          schema = z.email()
        }

        if (element.required) {
          schema = schema.min(1)
        }

        formSchema[element.name] = schema
        break
      }

      case 'dropdown': {
        formSchema[element.name] = z.enum(element.options.map((option) => option.value))
        break
      }

      case 'file-upload': {
        let schema: ValidZodFile = z.file().max(MAX_FILE_SIZE).mime(VALID_MIME_TYPES)
        if (!element.required) {
          schema = z.optional(schema)
        }

        formSchema[element.name] = schema
        break
      }
    }
  }

  return z.object(formSchema)
}
