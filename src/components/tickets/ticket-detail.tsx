import type { Ticket } from '@/api/types'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format, formatDistanceToNow } from 'date-fns'

export default function TicketDetail({ ticket }: { ticket: Ticket }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Ticket #{ticket.id}</CardTitle>
            <CardDescription>
              Created {format(ticket.createdAt, 'PPP')} • Last updated{' '}
              {formatDistanceToNow(ticket.updatedAt, { addSuffix: true })}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{ticket.formId}</Badge>
            <StatusBadge status={ticket.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Summary</h3>
          <p className="text-muted-foreground whitespace-pre-line">{ticket.summary}</p>
        </div>

        {Object.keys(ticket.form).length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(ticket.form).map(([key, value]) => (
                <div key={key}>
                  <span className="text-sm font-medium capitalize">{key.toLowerCase()}: </span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
