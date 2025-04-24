import type { TicketStatus } from '@/api/types'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'

const statusColors: Record<TicketStatus, string> = {
  open: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  pending: 'bg-red-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500',
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <Badge className={cn('text-xs', statusColors[status])}>{status}</Badge>
}
