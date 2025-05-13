import { useDeleteForm, useForms, useUpdateForm } from '@/api/forms'
import { EmptyState } from '@/components/empty-state'
import { PageLoader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { TKForm } from '@te-kudasai/forms'
import { Check, Edit2, Eye, FileX, MoreVertical, Plus, Trash2, XCircle } from 'lucide-react'
import { Link, Navigate } from 'react-router'

function FormCard({
  form,
  onToggleDisabled,
  onDelete,
}: { form: TKForm; onToggleDisabled: (form: TKForm) => void; onDelete: (form: TKForm) => void }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={cn('text-xl mb-2', form.disabled && 'line-through')}>{form.name}</CardTitle>
            <CardDescription>{form.description}</CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleDisabled(form)}>
                {form.disabled ? (
                  <>
                    <Check className="size-4" />
                    <span>Enable</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" />
                    <span>Disable</span>
                  </>
                )}
              </DropdownMenuItem>

              {form.disabled && !form.hasTickets && (
                <DropdownMenuItem variant="destructive" onClick={() => onDelete(form)}>
                  <Trash2 className="size-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">{form.elements.length} elements</div>
      </CardContent>
      <CardFooter className="flex justify-between border-t">
        <Link to={`/agent/forms/preview/${form.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 size-4" />
            Preview
          </Button>
        </Link>
        <Link to={`/agent/forms/${form.id}`}>
          <Button size="sm">
            <Edit2 className="mr-2 size-4" />
            Edit
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function FormList() {
  const { data: forms, isPending, error } = useForms()
  const { mutate: updateForm } = useUpdateForm()
  const { mutate: deleteForm } = useDeleteForm()

  const onToggleDisabled = (form: TKForm) => updateForm({ id: form.id, disabled: !form.disabled })
  const onDelete = (form: TKForm) => deleteForm(form.id)

  if (isPending) return <PageLoader />
  if (!forms || error) return <Navigate to="/agent" />

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Form List</h1>
        <Button asChild>
          <Link to="/agent/forms/new">
            <Plus className="size-4" />
            Create New Form
          </Link>
        </Button>
      </div>

      {forms.data.length === 0 && (
        <EmptyState
          icon={FileX}
          title="No forms found"
          description="You don't have any forms yet. Create one to get started."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.data.map((form) => (
          <FormCard key={form.id} form={form} onToggleDisabled={onToggleDisabled} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}
