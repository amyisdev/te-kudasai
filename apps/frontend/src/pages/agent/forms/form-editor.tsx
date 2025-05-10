import { useCreateForm, useForm, useUpdateForm } from '@/api/forms'
import FormBuilder from '@/components/form-builder/form-builder'
import { PageLoader } from '@/components/loader'
import type { CreateFormSchema } from '@te-kudasai/forms'
import { Navigate, useNavigate, useParams } from 'react-router'

export default function FormEditor() {
  const { formId } = useParams()

  const { data: form, isLoading, error } = useForm(formId ?? null)
  const { mutate: createForm } = useCreateForm()
  const { mutate: updateForm } = useUpdateForm()

  const navigate = useNavigate()

  const onSubmit = (data: CreateFormSchema) => {
    if (form?.data) {
      updateForm({ id: form.data.id, ...data })
    } else {
      createForm(data)
    }

    navigate('/agent/forms')
  }

  if (isLoading) return <PageLoader />
  if (error) return <Navigate to="/agent/forms" />

  return <FormBuilder onSubmit={onSubmit} initialForm={form?.data} />
}
