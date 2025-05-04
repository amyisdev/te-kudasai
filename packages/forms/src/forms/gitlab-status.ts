import { UserCheck } from 'lucide-react'
import { z } from 'zod'
import type { FieldType } from '../types'

export const id = 'gitlab-status'
export const name = 'Gitlab Status'
export const description = 'Request to block or unblock a Gitlab user'
export const icon = UserCheck
export const hasAutomation = true

export const validator = z.object({
  PROJECT_NAME: z.string().min(1),
  GITLAB_STATUS: z.enum(['block', 'unblock']),
  GITLAB_USERNAME: z.string().min(1),
})

export const fields = [
  {
    name: 'PROJECT_NAME',
    label: 'Project Name',
    type: 'text',
  },
  {
    name: 'GITLAB_STATUS',
    label: 'Gitlab Status',
    type: 'select',
    options: [
      { value: 'block', label: 'Block' },
      { value: 'unblock', label: 'Unblock' },
    ],
  },
  {
    name: 'GITLAB_USERNAME',
    label: 'Gitlab Username',
    type: 'text',
  },
] satisfies FieldType[]
