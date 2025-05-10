import { type UseMutationOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateFormSchema, TKForm, UpdateFormSchema } from '@te-kudasai/forms'
import { toast } from 'sonner'
import { $fetch } from './client'
import type { SuccessResponse } from './types'

export const useForms = () => {
  return useQuery({
    queryKey: ['/api/forms'],
    queryFn: () => $fetch<SuccessResponse<TKForm[]>>('/api/forms'),
  })
}

export const useForm = (id: string | null) => {
  return useQuery({
    queryKey: ['/api/forms', id],
    queryFn: () => $fetch<SuccessResponse<TKForm>>(`/api/forms/${id}`),
    enabled: !!id && id !== 'new',
  })
}

export const useCreateForm = (props?: UseMutationOptions<TKForm, unknown, CreateFormSchema>) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...props,
    mutationFn: (data: CreateFormSchema) =>
      $fetch<SuccessResponse<TKForm>>('/api/forms', { method: 'POST', body: data }).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] })
      toast.success(`Form ${data.name} has been created`)
    },
  })
}

interface UpdateForm extends UpdateFormSchema {
  id: string
}

export const useUpdateForm = (props?: UseMutationOptions<TKForm, unknown, UpdateForm>) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...props,
    mutationFn: (data: UpdateForm) =>
      $fetch<SuccessResponse<TKForm>>(`/api/forms/${data.id}`, { method: 'PATCH', body: data }).then((res) => res.data),
    onSuccess: (data, updated) => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] })

      // We only provide the necessary field when toggling disabled status
      if (updated.name === undefined) {
        toast.success(`Form ${data.name} has been ${data.disabled ? 'disabled' : 'enabled'}`)
      } else {
        toast.success(`Form ${data.name} has been updated`)
      }
    },
  })
}

export const useDeleteForm = (props?: UseMutationOptions<TKForm, unknown, string>) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...props,
    mutationFn: (id: string) =>
      $fetch<SuccessResponse<TKForm>>(`/api/forms/${id}`, { method: 'DELETE' }).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] })
      toast.success(`Form ${data.name} has been deleted`)
    },
  })
}

export const useEnabledForms = () => {
  return useQuery({
    queryKey: ['/api/forms', 'enabled'],
    queryFn: () => $fetch<SuccessResponse<TKForm[]>>('/api/forms/enabled'),
  })
}

export const useEnabledForm = (id: string | null) => {
  return useQuery({
    queryKey: ['/api/forms/enabled', id],
    queryFn: () => $fetch<SuccessResponse<TKForm>>(`/api/forms/enabled/${id}`),
    enabled: !!id,
  })
}
