import type { Ticket } from '@/api/types'
import { RenderForm } from '@/components/render-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import formTypes from '@te-kudasai/forms'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

export default function NewTicketForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const formId = searchParams.get('type')
  const formType = formTypes[formId!]

  const onSuccess = (ticket: Ticket) => {
    toast.success('Ticket submitted successfully')
    navigate(`/tickets/${ticket.id}`)
  }

  if (!formType || formType.disabled) return <Navigate to="/new-ticket" />

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/new-ticket">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to select ticket type</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{formType.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="tracking-tight">Ticket Information</CardTitle>
          <CardDescription>Provide details about your request.</CardDescription>
        </CardHeader>
        <CardContent>
          <RenderForm formType={formType} onSuccess={onSuccess} />
        </CardContent>
      </Card>
    </div>
  )
}
