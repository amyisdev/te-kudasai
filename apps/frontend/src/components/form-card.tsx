import { cn } from '@/lib/utils'
import type { FormType } from '@te-kudasai/forms'
import { ArrowRight } from 'lucide-react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Link } from 'react-router'

const variants = [
  {
    card: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
    icon: 'text-orange-500 dark:text-orange-400',
  },
  {
    card: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800',
    icon: 'text-yellow-500 dark:text-yellow-400',
  },
  {
    card: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
    icon: 'text-green-500 dark:text-green-400',
  },
  {
    card: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
    icon: 'text-blue-500 dark:text-blue-400',
  },
  {
    card: 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800',
    icon: 'text-purple-500 dark:text-purple-400',
  },
]

export default function FormCard({ type, variant = 0 }: { type: FormType; variant?: number }) {
  const variantClass = variant >= 0 ? variants[variant % variants.length] : variants[0]

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all hover:shadow-md dark:hover:shadow-md dark:hover:shadow-primary/5 cursor-pointer border-2',
        variantClass.card,
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{type.name}</CardTitle>
            <CardDescription className="mt-2">{type.description}</CardDescription>
          </div>
          <div className="p-2 rounded-full bg-white dark:bg-white/10 border dark:border-transparent shadow-sm">
            <type.icon className={cn('h-8 w-8', variantClass.icon)} />
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <p className="font-normal text-sm flex items-center">
          Select this type <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </p>
      </CardFooter>

      <Link to={`/new-ticket-form?type=${type.id}`} className="absolute inset-0">
        <span className="sr-only">Select {type.name}</span>
      </Link>
    </Card>
  )
}
