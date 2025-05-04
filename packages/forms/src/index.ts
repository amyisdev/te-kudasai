import { z } from 'zod'
import * as disabledForm from './forms/disabled-form'
import * as gitlabStatus from './forms/gitlab-status'
import * as sampleForm from './forms/sample-form'
import type { FormType } from './types'

export * from './types'

type NonEmptyArray<T> = [T, ...T[]]
type ValidZodString = z.ZodString | z.ZodOptional<z.ZodString>
type ValidZodSchema = ValidZodString | z.ZodEnum<NonEmptyArray<string>>

export function generateZodSchema(formType: FormType) {
  const formSchema: Record<string, ValidZodSchema> = {}

  for (const formField of formType.fields) {
    switch (formField.type) {
      case 'text':
      case 'long-text': {
        let schema: ValidZodString = z.string()
        if (formField.type === 'text' && formField.format === 'email') {
          schema = schema.email()
        }

        if (formField.optional) {
          schema = schema.optional()
        } else {
          schema = schema.min(1)
        }

        formSchema[formField.name] = schema
        break
      }

      case 'select': {
        formSchema[formField.name] = z.enum(formField.options.map((option) => option.value) as NonEmptyArray<string>)
        break
      }
    }
  }

  return z.object(formSchema)
}

export default {
  'sample-form': sampleForm,
  'gitlab-status': gitlabStatus,
  'disabled-form': disabledForm,
} as Record<string, FormType>
