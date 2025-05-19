import type { UserFilters } from '@/api/types'
import { useUsers } from '@/api/users'
import { EmptyState } from '@/components/empty-state'
import { ContainerLoader } from '@/components/loader'
import { Pagination } from '@/components/pagination'
import { Avatar, AvatarDiceBear, AvatarFallbackInitials } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useDebounce from '@/hooks/use-debounce'
import { authClient } from '@/lib/auth-client'
import { useQueryClient } from '@tanstack/react-query'
import { Filter, MoreHorizontal, Search, UserSearch } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'

interface FilterProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
}

function UserFilterFields({ filters, onFiltersChange }: FilterProps) {
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
            placeholder="Search by full name or email..."
            className="pl-8"
            value={immediateFilters.search}
            onChange={(e) => {
              setImmediateFilters({ ...immediateFilters, search: e.target.value, page: 1 })
            }}
          />
        </div>

        <div className="w-full sm:w-[180px]">
          <Select
            value={immediateFilters.role}
            onValueChange={(value) => {
              setImmediateFilters({ ...immediateFilters, role: value, page: 1 })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="sm:w-auto"
          onClick={() => {
            setImmediateFilters({ search: '', role: 'all', page: 1 })
          }}
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}

interface ListProps {
  filters: UserFilters
  onPageChange: (page: number) => void
}

export function UserList({ filters, onPageChange }: ListProps) {
  const queryClient = useQueryClient()
  const { data: users, isPending } = useUsers(filters)
  const currentUser = authClient.useSession()

  const total = users?.meta.pagination.total ?? 0
  const perPage = users?.meta.pagination.limit ?? 10
  const startIndex = (filters.page - 1) * perPage

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user'
    await authClient.admin.setRole({ userId, role: newRole })

    queryClient.invalidateQueries({ queryKey: ['/api/users', filters] })
    toast.success(`User role updated to ${newRole}`)
  }

  const handleBan = async (userId: string, banned: boolean) => {
    if (banned) {
      await authClient.admin.unbanUser({ userId })
    } else {
      await authClient.admin.banUser({ userId })
    }

    queryClient.invalidateQueries({ queryKey: ['/api/users', filters] })
    toast.success(banned ? 'User unbanned' : 'User banned')
  }

  return (
    <>
      {isPending && <ContainerLoader />}

      {users?.data.length === 0 && (
        <EmptyState icon={UserSearch} title="No users found" description="Try adjusting your search criteria." />
      )}

      {users?.data && users.data.length > 0 && (
        <div>
          <Card className="p-0 mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data.map((user) => (
                  <TableRow key={user.id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarDiceBear seed={user.id} />
                          <AvatarFallbackInitials name={user.name} />
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{user.banned ? 'Banned' : 'Active'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8" disabled={user.id === currentUser.data?.user.id}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, user.role!)}>
                            {user.role === 'user' ? 'Promote to Admin' : 'Demote to User'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBan(user.id, !!user.banned)}>
                            {user.banned ? 'Unban' : 'Ban'} User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {total > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + perPage, total)} of {total} users
            </p>
            <Pagination
              currentPage={filters.page}
              totalPages={users.meta.pagination.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default function AllUsers() {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' })
  const [role, setRole] = useQueryState('role', { defaultValue: 'all' })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const setFilters = useCallback(
    (filters: UserFilters) => {
      setSearch(filters.search)
      setRole(filters.role)
      setPage(filters.page)
    },
    [setSearch, setRole, setPage],
  )

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>

      <UserFilterFields filters={{ search, role, page }} onFiltersChange={setFilters} />
      <UserList filters={{ search, role, page }} onPageChange={(page) => setPage(page)} />
    </div>
  )
}
