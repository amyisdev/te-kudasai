import * as disabledForm from './forms/disabled-form'
import * as gitlabStatus from './forms/gitlab-status'
import * as sampleForm from './forms/sample-form'
import type { FormType } from './types'

export * from './types'

export default {
  'sample-form': sampleForm,
  'gitlab-status': gitlabStatus,
  'disabled-form': disabledForm,
} as Record<string, FormType>
