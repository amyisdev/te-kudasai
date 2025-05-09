import type { FormElement } from '@/api/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import FormTypeIcon from './form-type-icon'

interface SortableFormElementProps {
  element: FormElement
  isActive: boolean
  onClick: () => void
  onRemove: () => void
}

export default function SortableFormElement({ element, isActive, onClick, onRemove }: SortableFormElementProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: too lazy
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors',
        isActive && 'border-primary bg-muted/50',
      )}
      onClick={onClick}
    >
      <div
        className="p-2 text-muted-foreground cursor-grab touch-none"
        data-testid="grip"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-2 flex-1">
        <FormTypeIcon type={element.type} className="h-4 w-4" />
        <div>
          <p className="font-medium">{element.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {element.type.replace('-', ' ')}
            {element.type === 'dropdown' && ` • ${element.options?.length} options`}
            {element.required && ' • Required'}
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove element</span>
      </Button>
    </div>
  )
}
