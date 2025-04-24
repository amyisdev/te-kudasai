import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { $fetch } from './client'
import type { PaginatedResponse, Ticket } from './types'

interface TicketFilters {
  search: string
  status: string
  page: number
}

export const useTickets = (filters: TicketFilters) => {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => $fetch<PaginatedResponse<Ticket>>('/api/tickets/my', { params: filters }),
    placeholderData: keepPreviousData,
  })
}
