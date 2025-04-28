import { useTicket, useToggleAssignment, useUpdateTicket } from '@/api/tickets'
import type { Ticket } from '@/api/types'
import { EmptyState } from '@/components/empty-state'
import { PageLoader } from '@/components/loader'
import TicketDetail from '@/components/tickets/ticket-detail'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, FolderX, X } from 'lucide-react'
import { FetchError } from 'ofetch'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'

function TicketStatusCard({ ticket }: { ticket: Ticket }) {
  const queryClient = useQueryClient()
  const { mutate: updateTicket } = useUpdateTicket({
    onSuccess({ status }) {
      toast.success(`Ticket status has been updated to ${status}`)
      queryClient.invalidateQueries({ queryKey: ['/api/tickets', ticket.id] })
    },
    onError(error) {
      if (error instanceof FetchError) {
        toast.error(error.data.message)
      }
    },
  })

  const { mutate: updateTicketAssignment } = useToggleAssignment({
    onSuccess() {
      toast.success('Ticket assignment has been updated')
      queryClient.invalidateQueries({ queryKey: ['/api/tickets', ticket.id] })
    },
    onError(error) {
      if (error instanceof FetchError) {
        toast.error(error.data.message)
      }
    },
  })

  const onStatusChange = (status: string) => updateTicket({ id: ticket.id, status })
  const onToggleAssign = () => updateTicketAssignment({ id: ticket.id })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-2" htmlFor="status">
            Status
          </Label>
          <Select value={ticket.status} onValueChange={onStatusChange}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2">Assignment</Label>
          {ticket.assigneeId ? (
            <div className="flex items-center gap-2 p-2 border rounded-md">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{ticket.assigneeId.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate">{ticket.assigneeId}</span>

              <Button onClick={onToggleAssign} variant="ghost" size="icon" className="rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Remove assignment</span>
              </Button>
            </div>
          ) : (
            <Button onClick={onToggleAssign} variant="outline" className="w-full">
              Assign to me
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CustomerDetail({ ticket }: { ticket: Ticket }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm">Reporter ID</Label>
          <p>{ticket.reporterId}</p>
        </div>
        <div>
          <Label className="text-sm">Name</Label>
          <p>Unknown</p>
        </div>
        <div>
          <Label className="text-sm">Email</Label>
          <p>Unknown</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ManageTicket() {
  const { id } = useParams()
  const { data: ticket, isPending } = useTicket(Number(id!), true)

  if (isPending) return <PageLoader />

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/agent">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to all tickets</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Manage Ticket</h1>
      </div>

      {ticket ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TicketDetail ticket={ticket.data} />
          </div>
          <div className="space-y-6">
            <TicketStatusCard ticket={ticket.data} />
            <CustomerDetail ticket={ticket.data} />
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FolderX}
          title="Ticket not found"
          description="The ticket you are looking for does not exist or you don't have permission to view it."
        >
          <Button asChild>
            <Link to="/agent">Back to All Tickets</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  )
}
