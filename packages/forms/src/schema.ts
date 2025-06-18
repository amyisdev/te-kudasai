import { z } from 'zod/v4'

export const ELEMENT_TYPES = {
  TEXT_FIELD: 'text-field',
  TEXTAREA: 'textarea',
  DROPDOWN: 'dropdown',
  TEXT_PANEL: 'text-panel',
  FILE_UPLOAD: 'file-upload',
} as const

const textFieldSchema = z.object({
  type: z.literal(ELEMENT_TYPES.TEXT_FIELD),
  id: z.string().min(1),
  name: z.string().min(1),
  label: z.string(),
  required: z.boolean(),
  placeholder: z.string(),
  format: z.enum(['text', 'email']),
})

const textareaSchema = z.object({
  type: z.literal(ELEMENT_TYPES.TEXTAREA),
  id: z.string().min(1),
  name: z.string().min(1),
  label: z.string(),
  required: z.boolean(),
  placeholder: z.string(),
})

const dropdownSchema = z.object({
  type: z.literal(ELEMENT_TYPES.DROPDOWN),
  id: z.string().min(1),
  name: z.string().min(1),
  label: z.string(),
  options: z.array(
    z.object({
      id: z.string(),
      label: z.string().min(1),
      value: z.string().min(1),
    }),
  ),
})

const textPanelSchema = z.object({
  type: z.literal(ELEMENT_TYPES.TEXT_PANEL),
  id: z.string().min(1),
  name: z.string().min(1),
  content: z.string().min(1),
})

const uploadFileSchema = z.object({
  type: z.literal(ELEMENT_TYPES.FILE_UPLOAD),
  id: z.string().min(1),
  name: z.string().min(1),
  label: z.string(),
  required: z.boolean(),
})

export const createElementSchema = z.discriminatedUnion('type', [
  textFieldSchema,
  textareaSchema,
  dropdownSchema,
  textPanelSchema,
  uploadFileSchema,
])

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
