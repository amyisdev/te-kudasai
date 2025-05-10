import { useEnabledForm } from '@/api/forms'
import { useCreateTicket } from '@/api/tickets'
import { PageLoader } from '@/components/loader'
import { type FormSubmitData, RenderForm } from '@/components/render-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

export default function NewTicketForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: tkform, isPending, error } = useEnabledForm(searchParams.get('type'))

  const { mutate, isPending: isCreating } = useCreateTicket({
    onSuccess(ticket) {
      toast.success('Ticket submitted successfully')
      navigate(`/tickets/${ticket.id}`)
    },
  })

  const onSubmit = (data: FormSubmitData) => {
    mutate({ ...data, formId: tkform!.data.id })
  }

  if (isPending) return <PageLoader />
  if (!tkform || error) return <Navigate to="/new-ticket" />

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/new-ticket">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to select ticket type</span>
          </Link>
        </Button>
        <p className="text-3xl font-bold tracking-tight">New Ticket</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="tracking-tight">
            <h1>{tkform.data.name}</h1>
          </CardTitle>
          <CardDescription>{tkform.data.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <RenderForm tkForm={tkform.data} onSubmit={onSubmit} disabled={isCreating} />
        </CardContent>
      </Card>
    </div>
  )
}
