import { useTickets } from '@/api/tickets'
import { EmptyState } from '@/components/empty-state'
import { ContainerLoader } from '@/components/loader'
import { Pagination } from '@/components/pagination'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useDebounce from '@/hooks/use-debounce'
import { formatDistanceToNow } from 'date-fns'
import { Filter, FolderSearch, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

interface TicketFilters {
  search: string
  status: string
  page: number
}

function TicketList({ filters, onPageChange }: { filters: TicketFilters; onPageChange: (page: number) => void }) {
  const { data: tickets, isPending } = useTickets(filters)

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
        <div className="grid gap-6">
          {tickets.data.map((ticket) => (
            <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="block">
              <div className="group flex flex-col sm:flex-row items-start sm:items-center border rounded-md p-3 hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-start justify-between sm:items-center gap-2">
                    <h3 className="font-medium text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                      {ticket.summary}
                    </h3>
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
                    {ticket.formId}
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

function TicketFilters({
  filters,
  onFiltersChange,
}: { filters: TicketFilters; onFiltersChange: (filters: TicketFilters) => void }) {
  const [debouncedFilters, immediateFilters, setImmediateFilters] = useDebounce(filters, 500)

  useEffect(() => {
    onFiltersChange(debouncedFilters)
  }, [debouncedFilters, onFiltersChange])

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-8"
            value={immediateFilters.search}
            onChange={(e) => {
              setImmediateFilters({ ...immediateFilters, search: e.target.value, page: 1 })
            }}
          />
        </div>

        <div className="w-full sm:w-[180px]">
          <Select
            value={immediateFilters.status}
            onValueChange={(value) => {
              setImmediateFilters({ ...immediateFilters, status: value, page: 1 })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="sm:w-auto"
          onClick={() => {
            setImmediateFilters({ search: '', status: 'all', page: 1 })
          }}
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    status: 'all',
    page: 1,
  })

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <Link to="/new-ticket">
          <Button>Create New Ticket</Button>
        </Link>
      </div>

      <TicketFilters filters={filters} onFiltersChange={setFilters} />
      <TicketList filters={filters} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
    </div>
  )
}
