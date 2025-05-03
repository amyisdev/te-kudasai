import FormCard from '@/components/form-card'
import { objectKeys } from '@/lib/utils'
import formTypes from '@te-kudasai/forms'

export default function NewTicket() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Create New Ticket</h1>
      <p className="text-muted-foreground dark:text-gray-400 mb-8">Select the type of ticket you'd like to create</p>

      <div className="grid gap-6 md:grid-cols-2">
        {objectKeys(formTypes).map((formId, i) => (
          <FormCard key={formId} type={formTypes[formId]} variant={i} />
        ))}
      </div>
    </div>
  )
}
