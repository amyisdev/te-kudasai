export interface TKForm {
  id: string
  name: string
  description: string
  disabled?: boolean
  elements: FormElement[]
  hasTickets: boolean
}

interface FormElementBase {
  id: string
  name: string
}

interface TextFieldElement extends FormElementBase {
  type: 'text-field'
  label: string
  required: boolean
  placeholder: string
  format: 'text' | 'email'
}

interface TextareaElement extends FormElementBase {
  type: 'textarea'
  label: string
  required: boolean
  placeholder: string
}

interface DropdownElement extends FormElementBase {
  type: 'dropdown'
  label: string
  options: DropdownOption[]
}

interface DropdownOption {
  id: string
  label: string
  value: string
}

interface TextPanelElement extends FormElementBase {
  type: 'text-panel'
  content: string
}

interface FileUploadElement extends FormElementBase {
  type: 'file-upload'
  label: string
  required: boolean
}

export type FormElement = TextFieldElement | TextareaElement | DropdownElement | TextPanelElement | FileUploadElement

export type FormElementType = FormElement['type']

export type FileUploadResponse = {
  filename: string
  originalName: string
  url: string
}
