import type { Ticket } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { type FormElement, type TKForm, generateZodSchema } from '@te-kudasai/forms'
import { useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from './ui/textarea'

function ElementFieldRenderer({ element }: { element: FormElement }) {
  const { control } = useFormContext()

  if (element.type === 'text-panel') {
    return (
      <p key={element.id} className="rounded-lg p-4 bg-background border text-sm text-muted-foreground">
        {element.content}
      </p>
    )
  }

  return (
    <FormField
      control={control}
      name={`formResponse.${element.name}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{element.label}</FormLabel>

          {element.type === 'text-field' && (
            <FormControl>
              <Input {...field} />
            </FormControl>
          )}

          {element.type === 'textarea' && (
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          )}

          {element.type === 'dropdown' && (
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {element.options.map((option) => (
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
  )
}

const generateDefaultValues = (tkForm: TKForm, ticket?: Ticket) => {
  const defaultValues: Record<string, string> = {}

  for (const element of tkForm.elements) {
    const ticketValue = ticket?.formResponse?.[element.name]

    switch (element.type) {
      case 'text-field':
      case 'textarea':
        defaultValues[element.name] = ticketValue ?? ''
        break
      case 'dropdown': {
        const firstOption = element.options[0]
        defaultValues[element.name] = ticketValue ?? firstOption?.value ?? ''
        break
      }
    }
  }

  return defaultValues
}

export interface FormSubmitData {
  summary: string
  formResponse: Record<string, string | undefined>
}

export interface RenderProps {
  tkForm: TKForm
  ticket?: Ticket
  onSubmit: (data: FormSubmitData) => void
  disabled?: boolean
}

export function RenderForm({ tkForm, ticket, onSubmit, disabled = false }: RenderProps) {
  const schema = z.object({
    summary: z.string().min(1),
    formResponse: generateZodSchema(tkForm),
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      summary: tkForm.name,
      formResponse: generateDefaultValues(tkForm, ticket),
    },
  })

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

        {tkForm.elements.map((element) => (
          <ElementFieldRenderer key={element.id} element={element} />
        ))}

        <Button type="submit" disabled={disabled}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
