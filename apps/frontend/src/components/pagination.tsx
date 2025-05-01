import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null
  }

  // Generate page numbers to display
  const generatePages = () => {
    const pages = []
    const maxVisiblePages = 5 // Maximum number of page buttons to show

    // Always show first page
    pages.push(
      <Button
        key={1}
        variant={currentPage === 1 ? 'default' : 'outline'}
        size="icon"
        onClick={() => onPageChange(1)}
        className="h-8 w-8"
      >
        1
      </Button>,
    )

    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)

    // Adjust if we're near the start
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1)
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2)
    }

    // Add ellipsis if needed before middle pages
    if (startPage > 2) {
      pages.push(
        <Button key="start-ellipsis" variant="outline" size="icon" disabled className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>,
      )
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? 'default' : 'outline'}
          size="icon"
          onClick={() => onPageChange(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>,
      )
    }

    // Add ellipsis if needed after middle pages
    if (endPage < totalPages - 1) {
      pages.push(
        <Button key="end-ellipsis" variant="outline" size="icon" disabled className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? 'default' : 'outline'}
          size="icon"
          onClick={() => onPageChange(totalPages)}
          className="h-8 w-8"
        >
          {totalPages}
        </Button>,
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {generatePages()}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
