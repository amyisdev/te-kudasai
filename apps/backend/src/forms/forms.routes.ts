import { adminOnly, needAuth } from '@/auth/auth.middleware'
import { BadRequestError, NotFoundError } from '@/shared/app-error'
import { successResponse } from '@/shared/response'
import { sValidator } from '@hono/standard-validator'
import { createFormSchema, updateFormSchema } from '@te-kudasai/forms'
import { Hono } from 'hono'
import { createForm, deleteForm, getFormById, listForms, updateForm } from './forms.service'
import { formIdSchema } from './forms.validation'

const formsRoutes = new Hono()

formsRoutes
  .use('*', needAuth)

  .get('/enabled', async (c) => {
    const forms = await listForms({ disabled: false })
    return c.json(successResponse(forms))
  })

  .get('/enabled/:id', sValidator('param', formIdSchema), async (c) => {
    const { id } = c.req.valid('param')

    const form = await getFormById(id)
    if (!form || form.disabled) {
      throw new NotFoundError('Form not found')
    }

    return c.json(successResponse(form))
  })

  .use('*', adminOnly)

  .get('/', async (c) => {
    const forms = await listForms()
    return c.json(successResponse(forms))
  })

  .post('/', sValidator('json', createFormSchema), async (c) => {
    const data = c.req.valid('json')
    const form = await createForm(c.var.user.id, data)
    return c.json(successResponse(form))
  })

  .get('/:id', sValidator('param', formIdSchema), async (c) => {
    const { id } = c.req.valid('param')

    const form = await getFormById(id)
    if (!form) {
      throw new NotFoundError('Form not found')
    }

    return c.json(successResponse(form))
  })

  .patch('/:id', sValidator('param', formIdSchema), sValidator('json', updateFormSchema), async (c) => {
    const { id } = c.req.valid('param')
    const data = c.req.valid('json')

    const form = await updateForm(id, data)
    if (!form) {
      throw new NotFoundError('Form not found')
    }

    return c.json(successResponse(form))
  })

  .delete('/:id', sValidator('param', formIdSchema), async (c) => {
    const { id } = c.req.valid('param')

    const form = await getFormById(id)
    if (!form) {
      throw new NotFoundError('Form not found')
    }

    if (form.disabled !== true) {
      throw new BadRequestError('Form must be disabled before deleting', 'FORM_NOT_DISABLED')
    }

    // TODO: Disallow deletion of forms that have tickets
    const deletedForm = await deleteForm(id)
    return c.json(successResponse(deletedForm))
  })

export default formsRoutes
