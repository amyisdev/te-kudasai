import { useCreateTicket, useUpdateTicket } from '@/api/tickets'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { objectKeys } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { type BaseRenderProps, baseSchema, baseValues } from './_base'

export const id = 'sample-form'
export const name = 'Sample Form'
export const validator = z.object({
  NAME: z.string().min(1),
  EMAIL: z.string().email().min(1),
})

const formSchema = baseSchema.extend({ form: validator })
type FormValues = z.infer<typeof formSchema>
const defaultValues = {
  ...baseValues,
  summary: name,
  form: {
    NAME: '',
    EMAIL: '',
  },
}

// When ticket is provided, it will be used to prefill the form
export function render({ onSuccess, onError, ticket }: BaseRenderProps) {
  const { mutate: createTicket, isPending } = useCreateTicket({ onSuccess, onError })
  const { mutate: updateTicket } = useUpdateTicket({ onSuccess, onError })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      summary: ticket?.summary ?? defaultValues.summary,
      form: {
        NAME: ticket?.form?.NAME ?? defaultValues.form.NAME,
        EMAIL: ticket?.form?.EMAIL ?? defaultValues.form.EMAIL,
      },
    },
  })

  const onSubmit = (data: FormValues) => {
    if (ticket) {
      updateTicket({ ...data, id: ticket.id })
    } else {
      createTicket({ ...data, formId: id })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {objectKeys(baseValues).map((name) => (
          <FormField
            control={form.control}
            key={name}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{name.toLowerCase()}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {objectKeys(defaultValues.form).map((name) => (
          <FormField
            control={form.control}
            key={name}
            name={`form.${name}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{name.toLowerCase()}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button disabled={isPending} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
