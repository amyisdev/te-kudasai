import { authClient } from '@/lib/auth-client'
import { Navigate, Outlet } from 'react-router'
import { PageLoader } from '../loader'
import { MainNav } from '../main-nav'

export function RootLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <PageLoader />
  }

  if (!session) {
    return <Navigate to="/auth/login" />
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav user={session.user} />
      <main className="flex-1 py-6 px-4 md:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
