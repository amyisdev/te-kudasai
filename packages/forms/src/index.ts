import * as sampleForm from './forms/sample-form'
import type { FormType } from './types'

export * from './types'

export default {
  'sample-form': sampleForm,
} as Record<string, FormType>
