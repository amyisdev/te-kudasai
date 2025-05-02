import z from 'zod'

export const baseSchema = z.object({
  summary: z.string().min(1),
})

export const baseValues = {
  summary: '',
}
