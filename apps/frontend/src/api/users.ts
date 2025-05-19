import type { authClient } from '@/lib/auth-client'
import { useQuery } from '@tanstack/react-query'
import { keepPreviousData } from '@tanstack/react-query'
import { $fetch } from './client'
import type { PaginatedResponse, UserFilters } from './types'

export const useUsers = (filters: UserFilters) => {
  return useQuery({
    queryKey: ['/api/users', filters],
    queryFn: () =>
      $fetch<PaginatedResponse<(typeof authClient.$Infer.Session.user)[]>>('/api/users', { params: filters }),
    placeholderData: keepPreviousData,
  })
}
