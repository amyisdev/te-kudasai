import type { TicketFilters } from '@/api/types'
import { TicketFilterFields } from '@/components/tickets/ticket-filters'
import { TicketList } from '@/components/tickets/ticket-list'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useCallback } from 'react'

export default function AllTickets() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' })
  const [status, setStatus] = useQueryState('status', { defaultValue: 'all' })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const setFilters = useCallback(
    (filters: TicketFilters) => {
      setSearch(filters.search)
      setStatus(filters.status)
      setPage(filters.page)
    },
    [setSearch, setStatus, setPage],
  )

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Tickets</h1>

      <TicketFilterFields filters={{ search, status, page }} onFiltersChange={setFilters} />
      <TicketList filters={{ search, status, page }} onPageChange={(page) => setPage(page)} isAgent={true} />
    </div>
  )
}
