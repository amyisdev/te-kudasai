import App from '@/App'
import FormEditor from '@/pages/agent/forms/form-editor'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { authenticatedAgent } from '../../../msw/handlers/auth'
import { server } from '../../../msw/server'
import { renderWithRouter } from '../../../utils'

describe('Form Editor', () => {
  beforeEach(() => server.use(authenticatedAgent))

  it('should render form editor UI', async () => {
    renderWithRouter(<FormEditor />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Form Builder' })).toBeInTheDocument()
    })

    expect(screen.getByLabelText('Form Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Form Name')).toHaveValue('')
    expect(screen.getByLabelText('Form Description')).toBeInTheDocument()
    expect(screen.getByText('Form is empty')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Text Field' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Textarea' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dropdown' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Text Panel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('should populate form fields when editing and update form', async () => {
    const { user } = renderWithRouter(<App />, { route: '/agent/forms/sample-form' })

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Form Builder' })).toBeInTheDocument()
    })

    expect(screen.getByLabelText('Form Name')).toHaveValue('Sample Form')
    expect(screen.getByLabelText('Form Description')).toHaveValue('This is a sample form')
    expect(screen.queryByText('Form is empty')).not.toBeInTheDocument()
    expect(screen.getByText('announcement')).toBeInTheDocument()
    expect(screen.getByText('name')).toBeInTheDocument()
    expect(screen.getByText('message')).toBeInTheDocument()
    expect(screen.getByText('priority')).toBeInTheDocument()

    await user.click(screen.getAllByText('Remove element')[0])
    await user.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(screen.getByText('Form Sample Form has been updated')).toBeInTheDocument()
    })
  })

  it('should provide text-input element', async () => {
    const { user } = renderWithRouter(<FormEditor />)

    await user.click(screen.getByRole('button', { name: 'Text Field' }))
    expect(screen.getByText('new_element')).toBeInTheDocument()

    await user.click(screen.getByText('new_element'))

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Label')).toBeInTheDocument()
    expect(screen.getByLabelText('Placeholder')).toBeInTheDocument()

    const requiredSwitch = screen.getByRole('switch', { name: 'Required' })
    expect(requiredSwitch).toBeInTheDocument()
    await user.click(requiredSwitch)

    const updateButton = screen.getByRole('button', { name: 'Update' })
    expect(updateButton).toBeInTheDocument()
    await user.click(updateButton)
  })

  it('should provide textarea element', async () => {
    const { user } = renderWithRouter(<FormEditor />)

    await user.click(screen.getByRole('button', { name: 'Textarea' }))
    await user.click(screen.getByText('new_element'))

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Label')).toBeInTheDocument()
    expect(screen.getByLabelText('Placeholder')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Required' })).toBeInTheDocument()
  })

  it('should provide dropdown element', async () => {
    const { user } = renderWithRouter(<FormEditor />)

    await user.click(screen.getByRole('button', { name: 'Dropdown' }))
    await user.click(screen.getByText('new_element'))

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Label')).toBeInTheDocument()

    expect(screen.getByText('Options')).toBeInTheDocument()
    expect(screen.getAllByRole('textbox', { name: 'Option Value' })).toHaveLength(2)

    const addOptionButton = screen.getByRole('button', { name: 'Add Option' })
    expect(addOptionButton).toBeInTheDocument()
    await user.click(addOptionButton)
    expect(screen.getAllByRole('textbox', { name: 'Option Value' })).toHaveLength(3)

    const removeOptionButton = screen.getAllByRole('button', { name: 'Remove option' })
    await user.click(removeOptionButton[1])
    expect(screen.getAllByRole('textbox', { name: 'Option Value' })).toHaveLength(2)
  })

  it('should provide text-panel element', async () => {
    const { user } = renderWithRouter(<FormEditor />)

    await user.click(screen.getByRole('button', { name: 'Text Panel' }))
    await user.click(screen.getByText('new_element'))

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Content')).toBeInTheDocument()
  })

  it('should allow user to select and remove elements', async () => {
    const { user } = renderWithRouter(<FormEditor />)

    await user.click(screen.getByRole('button', { name: 'Text Panel' }))

    await user.click(screen.getByText('new_element')) // Select
    await user.clear(screen.getByLabelText('Name'))
    await user.type(screen.getByLabelText('Name'), 'panel_1')
    await user.type(screen.getByLabelText('Content'), 'This is panel 1')
    await user.click(screen.getByRole('button', { name: 'Update' }))
    await user.click(screen.getByText('panel_1')) // Unselect

    await user.click(screen.getByRole('button', { name: 'Text Panel' }))
    await user.click(screen.getByRole('button', { name: 'Text Panel' }))

    await user.click(screen.getAllByText('panel_1')[0])
    await user.click(screen.getAllByRole('button', { name: 'Remove element' })[0])

    // Currently not stable
    // For some reason this work on my pc but not on my laptop, bad cpu i guess
    const grip = screen.getAllByTestId('grip')[0]
    fireEvent.pointerDown(grip, { isPrimary: 1, button: 0 })
    fireEvent.pointerMove(grip, { clientY: 100 })
    fireEvent.pointerUp(grip)

    expect(screen.queryByText('panel_1')).not.toBeInTheDocument()
  })

  it('should create a new form', async () => {
    const { user } = renderWithRouter(<App />, { route: '/agent/forms/new' })

    await screen.findByRole('heading', { level: 1, name: 'Form Builder' })

    await user.type(screen.getByLabelText('Form Name'), 'New Form')
    await user.type(screen.getByLabelText('Form Description'), 'This is a new form')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.getByText('Form New Form has been created')).toBeInTheDocument()
    })
  })
})
