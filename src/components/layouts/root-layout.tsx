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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
