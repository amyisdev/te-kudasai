import type { TicketFilters } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useDebounce from '@/hooks/use-debounce'
import { Filter, Search } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  filters: TicketFilters
  onFiltersChange: (filters: TicketFilters) => void
}

export function TicketFilterFields({ filters, onFiltersChange }: Props) {
  const [debouncedFilters, immediateFilters, setImmediateFilters] = useDebounce(filters, 500)

  useEffect(() => {
    onFiltersChange(debouncedFilters)
  }, [debouncedFilters, onFiltersChange])

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-8"
            value={immediateFilters.search}
            onChange={(e) => {
              setImmediateFilters({ ...immediateFilters, search: e.target.value, page: 1 })
            }}
          />
        </div>

        <div className="w-full sm:w-[180px]">
          <Select
            value={immediateFilters.status}
            onValueChange={(value) => {
              setImmediateFilters({ ...immediateFilters, status: value, page: 1 })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="sm:w-auto"
          onClick={() => {
            setImmediateFilters({ search: '', status: 'all', page: 1 })
          }}
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}
