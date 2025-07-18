import { type UseMutationOptions, keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { FetchError } from 'ofetch'
import { toast } from 'sonner'
import { $fetch } from './client'
import type { PaginatedResponse, SuccessResponse, Ticket, TicketFilters, TicketForAgent } from './types'

export const useTickets = (filters: TicketFilters, isAgent = false) => {
  const path = isAgent ? '/api/tickets' : '/api/tickets/my'

  return useQuery({
    queryKey: [path, filters],
    queryFn: () => $fetch<PaginatedResponse<TicketForAgent[]>>(path, { params: filters }),
    placeholderData: keepPreviousData,
  })
}

export const useTicket = (id: number, isAgent = false) => {
  const path = isAgent ? '/api/tickets' : '/api/tickets/my'

  return useQuery({
    queryKey: [path, id],
    queryFn: () => $fetch<SuccessResponse<TicketForAgent>>(`${path}/${id}`),
    enabled: !!id,
    retry(failureCount, error) {
      if (error instanceof FetchError && error.status === 404) {
        return false
      }

      return failureCount < 3
    },
  })
}

interface CreateTicket {
  summary: string
  formId: string
  formResponse: unknown
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

interface UpdateTicket {
  id: number
  status?: string
  summary?: string
  formResponse?: unknown
}

export const useUpdateTicket = (props?: UseMutationOptions<Ticket, unknown, UpdateTicket>) => {
  return useMutation({
    ...props,
    mutationFn: (data: UpdateTicket) =>
      $fetch<SuccessResponse<Ticket>>(`/api/tickets/${data.id}`, { method: 'PATCH', body: data }).then(
        (res) => res.data,
      ),
  })
}

export const useToggleAssignment = (props?: UseMutationOptions<Ticket, unknown, UpdateTicket>) => {
  return useMutation({
    ...props,
    mutationFn: (data: UpdateTicket) =>
      $fetch<SuccessResponse<Ticket>>(`/api/tickets/${data.id}/assign-toggle`, { method: 'POST', body: data }).then(
        (res) => res.data,
      ),
  })
}

export const useOpenForm = (props?: UseMutationOptions<Ticket, unknown, UpdateTicket>) => {
  return useMutation({
    ...props,
    mutationFn: (data: UpdateTicket) =>
      $fetch<SuccessResponse<Ticket>>(`/api/tickets/${data.id}/open-form`, { method: 'POST', body: data }).then(
        (res) => res.data,
      ),
  })
}
