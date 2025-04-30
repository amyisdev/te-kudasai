import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'
import type { authClient } from '@/lib/auth-client'
import { Laptop, LogOut, Moon, Palette, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { Avatar, AvatarDiceBear, AvatarFallbackInitials } from './ui/avatar'

const navItems = {
  customer: [
    {
      title: 'My Tickets',
      href: '/',
      description: 'View your tickets and status',
    },
    {
      title: 'New Ticket',
      href: '/new-ticket',
      description: 'Create a new support ticket',
    },
  ],
  agent: [
    {
      title: 'All Tickets',
      href: '/agent',
      description: 'View all tickets and status',
    },
  ],
}

export function MainNav({ user }: { user: typeof authClient.$Infer.Session.user }) {
  const { pathname } = useLocation()
  const userType = pathname.includes('agent') ? 'agent' : 'customer'
  const { colorScheme, setColorScheme, themeMode, setThemeMode } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-brand/95 backdrop-blur supports-[backdrop-filter]:bg-brand/60 shadow-sm">
      <div className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Te Kudasai</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          {navItems[userType].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              {item.title}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full" aria-label="User menu">
                <Avatar className="h-6 w-6">
                  <AvatarDiceBear seed={user.id} />
                  <AvatarFallbackInitials name={user.name} />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Theme Selector Sub-menu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="mr-2 h-4 w-4" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {/* Color Scheme Group */}
                  <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={colorScheme}
                    onValueChange={(v) => setColorScheme(v as typeof colorScheme)}
                  >
                    <DropdownMenuRadioItem value="neutral">Neutral</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="pastel">Pastel</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="pink">Pink</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />

                  {/* Mode Group */}
                  <DropdownMenuLabel>Mode</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={themeMode} onValueChange={(v) => setThemeMode(v as typeof themeMode)}>
                    <DropdownMenuRadioItem value="light">
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Laptop className="mr-2 h-4 w-4" />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>TODO: Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
