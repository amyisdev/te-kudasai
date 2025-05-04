import { ofetch } from 'ofetch'

export const $fetch = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL,
  retry: 0,
  credentials: 'include',
})
