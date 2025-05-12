import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FormElement, FormElementType, TKForm } from '@te-kudasai/forms'
import {
  type CreateElementSchema,
  type CreateFormSchema,
  createElementSchema,
  createFormSchema,
} from '@te-kudasai/forms'
import { Plus, Save, Trash2, X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { Link } from 'react-router'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'
import FormTypeIcon from './form-type-icon'
import SortableFormElement from './sortable-form-element'

function generateElement(type: FormElementType) {
  const element: FormElement = {
    id: nanoid(11),
    name: 'new_element',
    type,
    label: 'New Element',
    required: false,
    placeholder: '',
    format: 'text',
    options: [],
    content: '',
  }

  if (element.type === 'dropdown') {
    element.options = [
      {
        id: nanoid(11),
        label: 'Option 1',
        value: 'option_1',
      },
      {
        id: nanoid(11),
        label: 'Option 2',
        value: 'option_2',
      },
    ]
  }

  return element
}

function AddElementButtons({ createNewElement }: { createNewElement: (type: FormElementType) => void }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      <Button type="button" variant="outline" onClick={() => createNewElement('text-field')}>
        <FormTypeIcon type="text-field" className="h-4 w-4" />
        Text Field
      </Button>
      <Button type="button" variant="outline" onClick={() => createNewElement('textarea')}>
        <FormTypeIcon type="textarea" className="h-4 w-4" />
        Textarea
      </Button>
      <Button type="button" variant="outline" onClick={() => createNewElement('dropdown')}>
        <FormTypeIcon type="dropdown" className="h-4 w-4" />
        Dropdown
      </Button>
      <Button type="button" variant="outline" onClick={() => createNewElement('text-panel')}>
        <FormTypeIcon type="text-panel" className="h-4 w-4" />
        Text Panel
      </Button>
    </div>
  )
}

function FormHeader() {
  const { control } = useFormContext<CreateFormSchema>()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Form Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Form Description</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function ElementProperties({
  element,
  onSubmit,
}: { element: FormElement; onSubmit: (data: CreateElementSchema) => void }) {
  const form = useForm<CreateElementSchema>({
    resolver: zodResolver(createElementSchema),
    // For form, we need to set the defaultValues with all properties from all element types
    defaultValues: { ...generateElement(element.type), ...element },
  })

  const {
    fields: options,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  useEffect(() => {
    form.reset({ ...generateElement(element.type), ...element })
  }, [element, form.reset])

  const onAddOption = () => {
    append({
      id: nanoid(11),
      label: `Option ${options.length + 1}`,
      value: `option_${options.length + 1}`,
    })
  }

  const onRemoveOption = (index: number) => {
    remove(index)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {element.type !== 'text-panel' && (
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(element.type === 'text-field' || element.type === 'textarea') && (
            <>
              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Required</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </>
          )}

          {element.type === 'text-field' && (
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {element.type === 'text-panel' && (
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {element.type === 'dropdown' && (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => onAddOption()}>
                  <Plus className="h-4 w-4" />
                  Add Option
                </Button>
              </div>

              {options.map((option, index) => (
                <div key={option.id} className="grid gap-2 grid-cols-[1fr_1fr_auto]">
                  <FormField
                    control={form.control}
                    name={`options.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        {/* This is not the best way to label things */}
                        <FormLabel className="sr-only">Option Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Label" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`options.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Option Value</FormLabel>
                        <FormControl>
                          <Input placeholder="Value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveOption(index)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove option</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button type="submit">Update</Button>
        </div>
      </form>
    </Form>
  )
}

function ElementsBuilder({
  elements,
  onAdd,
  onRemove,
  onMove,
  onUpdate,
}: {
  elements: FormElement[]
  onAdd: (element: FormElement) => void
  onRemove: (index: number) => void
  onMove: (from: number, to: number) => void
  onUpdate: (index: number, element: FormElement) => void
}) {
  const [activeElement, setActiveElement] = useState<{ element: FormElement; index: number } | null>(null)

  const modifiers = [restrictToVerticalAxis, restrictToParentElement]
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const createNewElement = (type: FormElementType) => {
    onAdd(generateElement(type))
  }

  const removeElement = (id: string) => {
    if (activeElement?.element.id === id) {
      setActiveElement(null)
    }

    onRemove(elements.findIndex((el) => el.id === id))
  }

  const onSelectElement = (element: FormElement, index: number) => {
    if (activeElement?.element.id === element.id) {
      setActiveElement(null)
      return
    }

    setActiveElement({ element, index })
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const activeIndex = active.data.current?.sortable?.index
      const overIndex = over.data.current?.sortable?.index
      if (activeIndex !== undefined && overIndex !== undefined) {
        onMove(activeIndex, overIndex)

        // When selecting an element we set the index
        // After moving an element we need to reset the index or it will break dnd-kit
        // FIXME: Right now im not sure how, so we just reset the active element
        setActiveElement(null)
      }
    }
  }

  return (
    <div className="flex gap-8">
      <div className="flex-1 space-y-6">
        {elements.length === 0 ? (
          <EmptyState title="Form is empty" description="Start building your form by adding an element">
            <AddElementButtons createNewElement={createNewElement} />
          </EmptyState>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Add, arrange, and customize your form elements.</CardDescription>
            </CardHeader>
            <CardContent>
              <DndContext
                modifiers={modifiers}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext items={elements.map((el) => el.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {elements.map((element, index) => (
                      <SortableFormElement
                        key={element.id}
                        element={element}
                        isActive={activeElement?.element.id === element.id}
                        onClick={() => onSelectElement(element, index)}
                        onRemove={() => removeElement(element.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="mt-4 pt-4 border-t flex justify-center">
                <AddElementButtons createNewElement={createNewElement} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="w-md">
        {/* Element toolbar */}
        <Card>
          <CardHeader>
            <CardTitle>Element Properties</CardTitle>
            <CardDescription>Configure the selected element's properties.</CardDescription>
          </CardHeader>
          <CardContent>
            {!activeElement && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground mb-4">Select an element to edit its properties</p>
              </div>
            )}

            {activeElement && (
              <ElementProperties
                element={activeElement.element}
                onSubmit={(data) => onUpdate(activeElement.index, data)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// FIXME: there must be something that can be done to make this component more performant or at least easier to maintain
export default function FormBuilder({
  initialForm,
  onSubmit,
}: { initialForm?: TKForm; onSubmit: (data: CreateFormSchema) => void }) {
  const form = useForm<CreateFormSchema>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: initialForm?.name || '',
      description: initialForm?.description || '',
      elements: initialForm?.elements || [],
    },
  })

  const { append, move, remove } = useFieldArray({
    control: form.control,
    name: 'elements',
  })

  const elements = form.watch('elements')

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Form Builder</h1>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link to="/agent/forms">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Link>
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <FormHeader />
          </div>
        </form>
      </Form>

      {/* Form Builder */}
      <ElementsBuilder
        elements={elements}
        onRemove={remove}
        onAdd={append}
        onMove={move}
        onUpdate={(index, element) => form.setValue(`elements.${index}`, element)}
      />
    </div>
  )
}
