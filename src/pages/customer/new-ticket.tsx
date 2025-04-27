import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import forms from '@/forms'
import { objectKeys } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

function CreateTicketForm() {
  const [formId, setFormId] = useState('')
  const Form = forms[formId as keyof typeof forms]

  const navigate = useNavigate()

  return (
    <>
      <div className="mb-6 grid gap-2 ">
        <Label htmlFor="form-select">Ticket Type</Label>
        <Select value={formId} onValueChange={setFormId}>
          <SelectTrigger id="form-select" className="w-full">
            <SelectValue placeholder="Select a ticket type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {objectKeys(forms).map((formId) => (
                <SelectItem key={formId} value={formId}>
                  {forms[formId].name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {Form && (
        <div className="border-t pt-6">
          <Form.render onSuccess={(data) => navigate(`/tickets/${data.id}`)} />
        </div>
      )}
    </>
  )
}

export default function NewTicket() {
  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to my tickets</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Ticket</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
          <CardDescription>Select a ticket type and provide details about your request.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTicketForm />
        </CardContent>
      </Card>
    </div>
  )
}
