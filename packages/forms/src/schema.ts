import { z } from 'zod'

export const ELEMENT_TYPES = {
  TEXT_FIELD: 'text-field',
  TEXTAREA: 'textarea',
  DROPDOWN: 'dropdown',
  TEXT_PANEL: 'text-panel',
} as const

export const createElementSchema = z.object({
  id: z.string().min(1),
  type: z.enum([ELEMENT_TYPES.TEXT_FIELD, ELEMENT_TYPES.TEXTAREA, ELEMENT_TYPES.DROPDOWN, ELEMENT_TYPES.TEXT_PANEL]),
  name: z.string().min(1),

  label: z.string().optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .optional(),
  content: z.string().optional(),
})

export type CreateElementSchema = z.infer<typeof createElementSchema>

export const createFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  disabled: z.boolean().optional(),
  elements: z.array(createElementSchema),
})

export type CreateFormSchema = z.infer<typeof createFormSchema>

export const updateFormSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  disabled: z.boolean().optional(),
  elements: z.array(createElementSchema).optional(),
})

export type UpdateFormSchema = z.infer<typeof updateFormSchema>
