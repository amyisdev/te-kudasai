import type { TKForm } from '@te-kudasai/forms'
import { http, HttpResponse } from 'msw'

function formFactory(overrides: Partial<TKForm> = {}): TKForm {
  return {
    id: '1',
    name: 'Test Form',
    description: 'Test Form Description',
    disabled: false,
    elements: [],
    ...overrides,
  }
}

export const forms = [
  formFactory({
    id: 'disabled-form',
    name: 'Disabled Form',
    description: 'This is a disabled form',
    disabled: true,
  }),

  formFactory({
    id: 'sample-form',
    name: 'Sample Form',
    description: 'This is a sample form',
    elements: [
      { type: 'text-panel', name: 'announcement', id: 'announcement', content: 'Announcement' },
      {
        type: 'text-field',
        name: 'name',
        label: 'Name',
        id: 'name',
        required: true,
        placeholder: 'Name',
        format: 'text',
      },
      { type: 'textarea', name: 'message', label: 'Message', id: 'message', required: true, placeholder: 'Message' },
      {
        type: 'dropdown',
        name: 'priority',
        label: 'Priority',
        id: 'priority',
        options: [
          { id: 'high', value: 'high', label: 'High' },
          { id: 'medium', value: 'medium', label: 'Medium' },
          { id: 'low', value: 'low', label: 'Low' },
        ],
      },
    ],
  }),
]

const filterForms = (enabledOnly = false) => {
  return forms.filter((form) => (enabledOnly ? !form.disabled : true))
}

export const listEnabledForms = http.get('http://localhost:3000/api/forms/enabled', () => {
  return HttpResponse.json({
    data: filterForms(true),
    status: 'success',
  })
})

export const listEnabledFormsEmpty = http.get('http://localhost:3000/api/forms/enabled', () => {
  return HttpResponse.json({
    data: [],
    status: 'success',
  })
})

export const getEnabledForm = http.get('http://localhost:3000/api/forms/enabled/:id', ({ params }) => {
  const form = forms.find((form) => form.id === params.id)
  if (!form || form.disabled) {
    return HttpResponse.json(
      {
        code: 'NOT_FOUND',
        message: 'Form not found',
        status: 'error',
      },
      { status: 404 },
    )
  }

  return HttpResponse.json({
    data: form,
    status: 'success',
  })
})

export const listForms = http.get('http://localhost:3000/api/forms', () => {
  return HttpResponse.json({
    data: forms,
    status: 'success',
  })
})

export const listFormsEmpty = http.get('http://localhost:3000/api/forms', () => {
  return HttpResponse.json({
    data: [],
    status: 'success',
  })
})

export const getForm = http.get('http://localhost:3000/api/forms/:id', ({ params }) => {
  const form = forms.find((form) => form.id === params.id)
  if (!form) {
    return HttpResponse.json(
      {
        code: 'NOT_FOUND',
        message: 'Form not found',
        status: 'error',
      },
      { status: 404 },
    )
  }

  return HttpResponse.json({
    data: form,
    status: 'success',
  })
})

export const createForm = http.post('http://localhost:3000/api/forms', async ({ request }) => {
  const body = (await request.json()) as Partial<TKForm>
  return HttpResponse.json({
    data: {
      ...formFactory(),
      ...body,
    },
    status: 'success',
  })
})

export const createFormFailed = http.post('http://localhost:3000/api/forms', () => {
  return HttpResponse.json(
    {
      code: 'INVALID_FORM_DATA',
      message: 'Invalid form data',
      status: 'error',
    },
    { status: 400 },
  )
})

export const updateForm = http.patch('http://localhost:3000/api/forms/:id', async ({ params, request }) => {
  const body = (await request.json()) as Partial<TKForm>
  const form = forms.find((form) => form.id === params.id)

  return HttpResponse.json({
    data: { ...form, ...body },
    status: 'success',
  })
})

export const updateFormFailed = http.patch('http://localhost:3000/api/forms/:id', () => {
  return HttpResponse.json(
    {
      code: 'UNKNOWN_ERROR',
      message: 'Unknown error',
      status: 'error',
    },
    { status: 500 },
  )
})

export const deleteForm = http.delete('http://localhost:3000/api/forms/:id', ({ params }) => {
  return HttpResponse.json({
    data: forms.find((form) => form.id === params.id),
    status: 'success',
  })
})

export const deleteFormFailed = http.delete('http://localhost:3000/api/forms/:id', () => {
  return HttpResponse.json(
    {
      code: 'UNKNOWN_ERROR',
      message: 'Unknown error',
      status: 'error',
    },
    { status: 500 },
  )
})

export const handlers = [
  listEnabledForms,
  getEnabledForm,

  listForms,
  getForm,
  createForm,
  updateForm,
  deleteForm,
]
