import { useTicket } from '@/api/tickets'
import { EmptyState } from '@/components/empty-state'
import { PageLoader } from '@/components/loader'
import TicketDetail from '@/components/tickets/ticket-detail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FolderX } from 'lucide-react'
import { Link, useParams } from 'react-router'

export default function ViewTicket() {
  const { id } = useParams()
  const { data: ticket, isPending } = useTicket(id!)

  if (isPending) return <PageLoader />

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to my tickets</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">View Ticket</h1>
      </div>

      {ticket ? (
        <TicketDetail ticket={ticket.data} />
      ) : (
        <EmptyState
          icon={FolderX}
          title="Ticket not found"
          description="The ticket you are looking for does not exist or you don't have permission to view it."
        >
          <Button asChild>
            <Link to="/">Back to My Tickets</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  )
}
