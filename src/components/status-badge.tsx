import type { TicketStatus } from '@/api/types'
import { Badge } from './ui/badge'

const statusColors = {
  open: 'blue',
  in_progress: 'yellow',
  pending: 'red',
  resolved: 'green',
  closed: 'gray',
} as const

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge className="text-xs" variant={statusColors[status]}>
      {status}
    </Badge>
  )
}
