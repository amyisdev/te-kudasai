import { type UseMutationOptions, keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { FetchError } from 'ofetch'
import { toast } from 'sonner'
import { $fetch } from './client'
import type { PaginatedResponse, SuccessResponse, Ticket } from './types'

interface TicketFilters {
  search: string
  status: string
  page: number
}

export const useTickets = (filters: TicketFilters) => {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => $fetch<PaginatedResponse<Ticket[]>>('/api/tickets/my', { params: filters }),
    placeholderData: keepPreviousData,
  })
}

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => $fetch<SuccessResponse<Ticket>>(`/api/tickets/my/${id}`),
    enabled: !!id,
  })
}

interface CreateTicket {
  summary: string
  formId: string
  form: unknown
}

export const useCreateTicket = (props?: UseMutationOptions<Ticket, unknown, CreateTicket>) => {
  return useMutation({
    ...props,
    mutationFn: (data: CreateTicket) =>
      $fetch<SuccessResponse<Ticket>>('/api/tickets/my', { method: 'POST', body: data }).then((res) => res.data),
    onError(error) {
      if (error instanceof FetchError) {
        toast.error(error.data.message)
      }
    },
  })
}
