import { useEnabledForms } from '@/api/forms'
import FormCard from '@/components/form-card'
import { PageLoader } from '@/components/loader'
import { Navigate } from 'react-router'

export default function NewTicket() {
  const { data: tkForms, isPending, error } = useEnabledForms()

  if (isPending) return <PageLoader />
  if (!tkForms || error) return <Navigate to="/" />

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Create New Ticket</h1>
      <p className="text-muted-foreground dark:text-gray-400 mb-8">Select the type of ticket you'd like to create</p>

      <div className="grid gap-6 md:grid-cols-2">
        {tkForms.data.map((form, i) => (
          <FormCard key={form.id} tkForm={form} variant={i} />
        ))}
      </div>
    </div>
  )
}
