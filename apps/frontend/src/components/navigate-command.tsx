import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { FileText, List, ListTodo, Plus, Users } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router'

const navigations = [
  { label: 'My Tickets', to: '/', icon: ListTodo, onlyAgent: false },
  { label: 'New Ticket', to: '/new-ticket', icon: Plus, onlyAgent: false },
  { label: 'All Tickets', to: '/agent', icon: List, onlyAgent: true },
  { label: 'Form Builder', to: '/agent/forms', icon: FileText, onlyAgent: true },
  { label: 'All Users', to: '/admin/users', icon: Users, onlyAgent: true },
]

export function NavigateCommand({ isAgent }: { isAgent?: boolean }) {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (cmd: () => unknown) => {
    setOpen(false)
    cmd()
  }

  const filteredNavigations = navigations.filter((navigation) => !navigation.onlyAgent || isAgent)

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate to">
          {filteredNavigations.map((navigation) => (
            <CommandItem
              key={navigation.to}
              onSelect={() => runCommand(() => navigate(navigation.to))}
              disabled={navigation.onlyAgent && !isAgent}
            >
              <navigation.icon />
              <span>{navigation.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  )
}
