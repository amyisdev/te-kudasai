import { useTickets } from '@/api/tickets'
import type { TicketFilters } from '@/api/types'
import { EmptyState } from '@/components/empty-state'
import { ContainerLoader } from '@/components/loader'
import { Pagination } from '@/components/pagination'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { FolderSearch } from 'lucide-react'
import { Link } from 'react-router'

interface Props {
  filters: TicketFilters
  onPageChange: (page: number) => void
  isAgent?: boolean
}

export function TicketList({ filters, onPageChange, isAgent = false }: Props) {
  const { data: tickets, isPending } = useTickets(filters, isAgent)

  const total = tickets?.meta.pagination.total ?? 0
  const perPage = tickets?.meta.pagination.limit ?? 10
  const startIndex = (filters.page - 1) * perPage

  return (
    <>
      {isPending && <ContainerLoader />}

      {tickets?.data.length === 0 && (
        <EmptyState
          icon={FolderSearch}
          title="No tickets found"
          description="You haven't created any tickets that match your current filters. Try adjusting your search criteria or create a new ticket."
        />
      )}

      {tickets?.data && (
        <div className="grid gap-2">
          {tickets.data.map((ticket) => (
            <Link key={ticket.id} to={`${isAgent ? '/agent' : ''}/tickets/${ticket.id}`} className="block">
              <div className="group flex flex-col sm:flex-row items-start sm:items-center border rounded-md p-3 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-start justify-between sm:items-center gap-2">
                    <p className="font-medium text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                      {ticket.summary}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1 sm:gap-3 text-xs text-muted-foreground mt-1">
                    <span className="inline-flex items-center">ID: #{ticket.id}</span>
                    <span>•</span>
                    <span className="inline-flex items-center">
                      Created {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <Badge variant="outline" className="text-xs">
                    {ticket.form.name}
                  </Badge>
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            </Link>
          ))}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {total > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + perPage, total)} of {total} tickets
            </p>
            <Pagination
              currentPage={filters.page}
              totalPages={tickets.meta.pagination.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </>
  )
}
