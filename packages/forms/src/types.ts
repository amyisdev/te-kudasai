export interface TKForm {
  id: string
  name: string
  description: string
  disabled?: boolean
  elements: FormElement[]
}

// TODO: Should we separate each element type into its own interface?
export interface FormElement {
  id: string
  type: FormElementType
  name: string
  label?: string

  required?: boolean
  placeholder?: string
  options?: FormElementOption[]
  content?: string
}

export interface FormElementOption {
  id: string
  label: string
  value: string
}

export type FormElementType = 'text-field' | 'textarea' | 'dropdown' | 'text-panel'
