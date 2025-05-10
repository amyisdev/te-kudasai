import type { FormElementType } from '@te-kudasai/forms'
import { AlignLeft, FileText, List, Type } from 'lucide-react'

export default function FormTypeIcon({ type, className }: { type: FormElementType; className?: string }) {
  switch (type) {
    case 'text-field':
      return <Type className={className} />
    case 'textarea':
      return <AlignLeft className={className} />
    case 'dropdown':
      return <List className={className} />
    case 'text-panel':
      return <FileText className={className} />
  }
}
