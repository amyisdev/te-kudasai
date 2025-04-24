import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router'

const navItems = {
  customer: [
    {
      title: 'Dashboard',
      href: '/',
      description: 'View your tickets and status',
    },
    {
      title: 'New Ticket',
      href: '/new-ticket',
      description: 'Create a new support ticket',
    },
  ],
  agent: [],
} as const

export function MainNav() {
  const { pathname } = useLocation()
  const userType = pathname.includes('agent') ? 'agent' : 'customer'
  const baseUrl = userType === 'customer' ? '/' : '/agent'

  return (
    <div className="flex gap-6 md:gap-10 px-6">
      <Link to={baseUrl} className="hidden sm:inline-block flex items-center space-x-2 font-bold">
        {userType === 'customer' ? 'Customer Portal' : 'Agent Portal'}
      </Link>

      <nav className="flex gap-6">
        {navItems[userType].map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary',
              pathname === item.href ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
