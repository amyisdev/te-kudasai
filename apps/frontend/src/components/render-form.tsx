import { useCreateTicket, useUpdateTicket } from '@/api/tickets'
import type { Ticket } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { type FormType, generateZodSchema } from '@te-kudasai/forms'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from './ui/textarea'

const generateDefaultValues = (formType: FormType, ticket?: Ticket) => {
  const defaultValues: Record<string, string> = {}

  for (const formField of formType.fields) {
    const ticketValue = ticket?.form?.[formField.name]

    switch (formField.type) {
      case 'text':
      case 'long-text':
        defaultValues[formField.name] = ticketValue ?? ''
        break
      case 'select': {
        const firstOption = formField.options[0]
        defaultValues[formField.name] = ticketValue ?? firstOption.value
        break
      }
    }
  }

  return defaultValues
}

interface FormSubmitData {
  summary: string
  form: Record<string, string | undefined>
}

export interface RenderProps {
  formType: FormType
  ticket?: Ticket
  onSuccess?: (data: Ticket) => void
  onError?: (error: unknown) => void
}

export function RenderForm({ formType, ticket, onSuccess, onError }: RenderProps) {
  const { mutate: createTicket, isPending: isCreating } = useCreateTicket({ onSuccess, onError })
  const { mutate: updateTicket, isPending: isUpdating } = useUpdateTicket({ onSuccess, onError })

  const schema = z.object({
    summary: z.string().min(1),
    form: generateZodSchema(formType),
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      summary: formType.name,
      form: generateDefaultValues(formType, ticket),
    },
  })

  const onSubmit = (data: FormSubmitData) => {
    if (ticket) {
      updateTicket({ ...data, id: ticket.id })
    } else {
      createTicket({ ...data, formId: formType.id })
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formType.fields.map((formField) => (
          <FormField
            control={form.control}
            key={formField.name}
            name={`form.${formField.name}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{formField.label}</FormLabel>

                {formField.type === 'text' && (
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                )}

                {formField.type === 'long-text' && (
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                )}

                {formField.type === 'select' && (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formField.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" disabled={isCreating || isUpdating}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
