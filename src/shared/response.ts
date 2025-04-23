export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  status: 'success'
  data: T
  meta?: {
    pagination?: PaginationMeta
  }
}

export function successResponse<T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> {
  return {
    status: 'success',
    data,
    ...(meta && { meta }),
  }
}

export function paginatedResponse<T>(
  data: T[],
  { page = 1, limit = 10, total = data.length }: Partial<PaginationMeta> = {},
): ApiResponse<T[]> {
  return successResponse(data, {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
