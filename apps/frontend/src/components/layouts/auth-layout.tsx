import { authClient } from '@/lib/auth-client'
import { Navigate, Outlet } from 'react-router'
import { PageLoader } from '../loader'

export default function AuthLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <PageLoader />
  }

  if (session) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
