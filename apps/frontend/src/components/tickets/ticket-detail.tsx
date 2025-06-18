import type { TicketForUser } from '@/api/types'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format, formatDistanceToNow } from 'date-fns'

export default function TicketDetail({ ticket }: { ticket: TicketForUser }) {
  const formResponse = ticket.form.elements
    .map((element) =>
      element.type === 'text-panel'
        ? null
        : {
            key: element.label,
            value: ticket.formResponse[element.name],
          },
    )
    .filter((element) => element !== null)

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
            <Badge variant="outline">{ticket.form.name}</Badge>
            <StatusBadge status={ticket.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Summary</h3>
          <p className="text-muted-foreground whitespace-pre-line">{ticket.summary}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Form Answers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formResponse.map(({ key, value }) => (
              <div key={key}>
                <span className="text-sm font-medium">{key}: </span>
                {typeof value === 'string' ? (
                  <span className="text-muted-foreground">{value}</span>
                ) : (
                  <a href={value.url} target="_blank" rel="noopener noreferrer">
                    {value.originalName}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
